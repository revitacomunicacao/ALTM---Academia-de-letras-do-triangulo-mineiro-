// src/app/acervo/index.tsx
import { useMemo, useState } from "react"
import { useContent } from "@/hooks/useContent"
import { PageHeader } from "@/components/PageHeader"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { FaBookOpen, FaTimes, FaArrowLeft } from "react-icons/fa"
import { IAcervo } from "./types/IAcervo"

// Skeleton da tabela (2 colunas)
const TableSkeleton = () => (
  <Card>
    <div className="px-6 py-4 bg-gray-100 border-b border-gray-200">
      <Skeleton className="h-6 w-1/3" />
    </div>

    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="px-6 py-4 text-left">
              <Skeleton className="h-4 w-40" />
            </th>
            <th className="px-6 py-4 text-left">
              <Skeleton className="h-4 w-28" />
            </th>
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-200">
          {[...Array(8)].map((_, i) => (
            <tr key={i} className="hover:bg-gray-50">
              <td className="px-6 py-5">
                <Skeleton className="h-4 w-64" />
              </td>
              <td className="px-6 py-5">
                <Skeleton className="h-4 w-20" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </Card>
)

function normalizeForSort(value?: string) {
  const s = (value || "").toString().trim()
  const normalized = typeof (s as any).normalize === "function" ? s.normalize("NFD") : s
  return normalized.replace(/[\u0300-\u036f]/g, "").toLowerCase()
}

export default function AcervoBibliografico() {
  const { data: acervo, loading, error, refetch } = useContent<IAcervo>("/acervo")

  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxSrc, setLightboxSrc] = useState<string>("")
  const [lightboxAlt, setLightboxAlt] = useState<string>("Capa")

  const [selectedAuthorKey, setSelectedAuthorKey] = useState<string | null>(null)
  const [selectedAuthorLabel, setSelectedAuthorLabel] = useState<string>("")

  const openLightbox = (src: string, alt?: string) => {
    setLightboxSrc(src)
    setLightboxAlt(alt || "Capa")
    setLightboxOpen(true)
  }

  const page = useMemo(() => {
    if (!Array.isArray(acervo) || acervo.length === 0) return null
    return acervo[0]
  }, [acervo])

  const titulos = useMemo(() => {
    const list = page?.titulos
    return Array.isArray(list) ? list : []
  }, [page])

  // Ordena títulos (para a tela do autor)
  const sortedTitulos = useMemo(() => {
    return [...titulos].sort((a, b) => {
      const aAutor = normalizeForSort(a.autor)
      const bAutor = normalizeForSort(b.autor)
      if (aAutor < bAutor) return -1
      if (aAutor > bAutor) return 1

      const aTitulo = normalizeForSort(a.titulo)
      const bTitulo = normalizeForSort(b.titulo)
      if (aTitulo < bTitulo) return -1
      if (aTitulo > bTitulo) return 1
      return 0
    })
  }, [titulos])

  // Lista única de autores (tela inicial)
  const authors = useMemo(() => {
    const map = new Map<
      string,
      {
        key: string
        label: string
        count: number
      }
    >()

    for (const t of sortedTitulos) {
      const label = (t.autor || "").toString().trim()
      if (!label) continue
      const key = normalizeForSort(label)
      if (!key) continue

      const current = map.get(key)
      if (current) {
        current.count += 1
      } else {
        map.set(key, { key, label, count: 1 })
      }
    }

    return Array.from(map.values()).sort((a, b) => {
      const aa = normalizeForSort(a.label)
      const bb = normalizeForSort(b.label)
      if (aa < bb) return -1
      if (aa > bb) return 1
      return 0
    })
  }, [sortedTitulos])

  // Títulos filtrados (quando um autor está selecionado)
  const filteredTitulos = useMemo(() => {
    if (!selectedAuthorKey) return []
    return sortedTitulos.filter((t) => normalizeForSort(t.autor) === selectedAuthorKey)
  }, [sortedTitulos, selectedAuthorKey])

  const isAuthorSelected = Boolean(selectedAuthorKey)

  if (loading) {
    return (
      <div className="min-h-screen bg-altm-page">
        <PageHeader
          title="Acervo Bibliográfico"
          subtitle="Carregando informações do acervo"
          icon={<FaBookOpen size={50} />}
          breadcrumb={[
            { label: "Home", href: "/" },
            { label: "Acervo Bibliográfico", href: "/acervo" },
          ]}
        />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <TableSkeleton />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-altm-page">
        <PageHeader
          title="Acervo Bibliográfico"
          subtitle="Erro ao carregar as informações"
          icon={<FaBookOpen size={50} />}
          breadcrumb={[
            { label: "Home", href: "/" },
            { label: "Acervo Bibliográfico", href: "/acervo" },
          ]}
        />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaTimes className="text-red-500 text-3xl" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Erro ao carregar dados</h3>
            <p className="text-gray-600 mb-6">Não foi possível carregar o acervo no momento.</p>
            <button
              onClick={() => refetch()}
              className="inline-flex items-center space-x-2 px-6 py-3 bg-altm-gold-600 text-white font-medium rounded-lg hover:bg-altm-gold-700 transition-colors"
            >
              <FaArrowLeft className="w-4 h-4" />
              <span>Tentar novamente</span>
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-altm-page">
      <PageHeader
        title={page?.title || "Acervo Bibliográfico"}
        icon={<FaBookOpen size={50} />}
        imagem_topo={page?.imagem_topo || undefined}
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: "Acervo Bibliográfico", href: "/acervo" },
        ]}
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* TELA 1: LISTA SOMENTE AUTORES */}
        {!isAuthorSelected ? (
          <Card>
            <div className="px-6 py-4 bg-gray-100 border-b border-gray-200 flex items-center justify-between gap-3">
              <h2 className="text-lg font-semibold text-gray-900">Autores</h2>
            </div>

            {authors.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                        Autor
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                        Títulos
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-200">
                    {authors.map((a) => (
                      <tr key={a.key} className="hover:bg-gray-50">
                        <td className="px-6 py-5">
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedAuthorKey(a.key)
                              setSelectedAuthorLabel(a.label)
                            }}
                            className="text-sm font-medium text-gray-900 hover:text-[#c1a44e] transition-colors underline-offset-2 hover:underline"
                          >
                            {a.label}
                          </button>
                        </td>
                        <td className="px-6 py-5">
                          <span className="text-sm text-gray-700">{a.count}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="px-6 py-10 text-center text-gray-600">Nenhum autor cadastrado no acervo.</div>
            )}
          </Card>
        ) : (
          /* TELA 2: TITULOS DO AUTOR SELECIONADO */
          <Card>
            <div className="px-6 py-4 bg-gray-100 border-b border-gray-200 flex items-center justify-between gap-3">
              <h2 className="text-lg font-semibold text-gray-900">
                Títulos — {selectedAuthorLabel}
              </h2>

              <button
                type="button"
                onClick={() => {
                  setSelectedAuthorKey(null)
                  setSelectedAuthorLabel("")
                }}
                className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 bg-white text-gray-700 hover:text-[#c1a44e] hover:border-[#c1a44e] transition-colors text-sm"
              >
                <FaArrowLeft className="w-4 h-4" />
                Voltar
              </button>
            </div>

            {filteredTitulos.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                        Título
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                        Capa
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-200">
                    {filteredTitulos.map((item, idx) => (
                      <tr key={idx} className="hover:bg-gray-50">
                        <td className="px-6 py-5">
                          {item.pdf ? (
                            <a
                              href={item.pdf}
                              target="_blank"
                              rel="noreferrer"
                              className="text-sm text-gray-900 hover:text-[#c1a44e] transition-colors underline-offset-2 hover:underline"
                              title="Abrir PDF"
                            >
                              {item.titulo || "-"}
                            </a>
                          ) : (
                            <div className="text-sm text-gray-800">{item.titulo || "-"}</div>
                          )}
                        </td>

                        <td className="px-6 py-5">
                          {item.capa ? (
                            <button
                              type="button"
                              onClick={() =>
                                openLightbox(item.capa, item.titulo ? `Capa: ${item.titulo}` : "Capa")
                              }
                              className="inline-flex"
                              aria-label={item.titulo ? `Abrir capa de ${item.titulo}` : "Abrir capa"}
                            >
                              <img
                                src={item.capa}
                                alt={item.titulo ? `Capa: ${item.titulo}` : "Capa"}
                                className="h-16 w-12 object-cover rounded-md border border-gray-200 hover:opacity-90 transition-opacity"
                                loading="lazy"
                              />
                            </button>
                          ) : (
                            <div className="h-16 w-12 rounded-md border border-gray-200 bg-gray-50" />
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="px-6 py-10 text-center text-gray-600">
                Nenhum título encontrado para este autor.
              </div>
            )}
          </Card>
        )}
      </div>

      <Dialog open={lightboxOpen} onOpenChange={setLightboxOpen}>
        <DialogContent className="max-w-4xl p-2 sm:p-4">
          {lightboxSrc ? (
            <img
              src={lightboxSrc}
              alt={lightboxAlt}
              className="w-full h-auto max-h-[80vh] object-contain rounded-md"
            />
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  )
}
