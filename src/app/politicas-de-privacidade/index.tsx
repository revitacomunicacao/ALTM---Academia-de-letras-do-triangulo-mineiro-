import { PageHeader } from "@/components/PageHeader"

export default function PoliticasDePrivacidade() {
  return (
    <div className="min-h-screen bg-gray-50">
      <PageHeader 
        title="Políticas de Privacidade"
        subtitle="Academia de Letras do Triângulo Mineiro"
        backgroundImage="/src/assets/banner-internas.jpg"
      />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="prose prose-lg max-w-none">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">1. Informações Gerais</h2>
            <p className="text-gray-700 mb-6">
              A Academia de Letras do Triângulo Mineiro (ALTM) respeita a privacidade de seus usuários e está comprometida 
              em proteger as informações pessoais coletadas através de nosso site. Esta Política de Privacidade descreve 
              como coletamos, usamos e protegemos suas informações.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-6">2. Informações que Coletamos</h2>
            <p className="text-gray-700 mb-4">
              Podemos coletar os seguintes tipos de informações:
            </p>
            <ul className="list-disc pl-6 text-gray-700 mb-6">
              <li>Informações de contato (nome, e-mail, telefone)</li>
              <li>Informações de navegação (endereço IP, tipo de navegador, páginas visitadas)</li>
              <li>Informações fornecidas voluntariamente através de formulários</li>
              <li>Cookies e tecnologias similares</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mb-6">3. Como Usamos suas Informações</h2>
            <p className="text-gray-700 mb-4">
              Utilizamos suas informações para:
            </p>
            <ul className="list-disc pl-6 text-gray-700 mb-6">
              <li>Fornecer e melhorar nossos serviços</li>
              <li>Responder a suas solicitações e comunicações</li>
              <li>Enviar informações sobre eventos e atividades da ALTM</li>
              <li>Analisar o uso do site para melhorias</li>
              <li>Cumprir obrigações legais</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mb-6">4. Compartilhamento de Informações</h2>
            <p className="text-gray-700 mb-6">
              Não vendemos, alugamos ou compartilhamos suas informações pessoais com terceiros, exceto quando necessário 
              para cumprir obrigações legais ou com seu consentimento explícito.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-6">5. Segurança dos Dados</h2>
            <p className="text-gray-700 mb-6">
              Implementamos medidas de segurança técnicas e organizacionais apropriadas para proteger suas informações 
              contra acesso não autorizado, alteração, divulgação ou destruição.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-6">6. Cookies</h2>
            <p className="text-gray-700 mb-6">
              Nosso site utiliza cookies para melhorar sua experiência de navegação. Você pode configurar seu navegador 
              para recusar cookies, mas isso pode afetar a funcionalidade do site.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-6">7. Seus Direitos</h2>
            <p className="text-gray-700 mb-4">
              Você tem o direito de:
            </p>
            <ul className="list-disc pl-6 text-gray-700 mb-6">
              <li>Acessar suas informações pessoais</li>
              <li>Corrigir informações incorretas</li>
              <li>Solicitar a exclusão de suas informações</li>
              <li>Retirar seu consentimento a qualquer momento</li>
              <li>Obter uma cópia de suas informações</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mb-6">8. Alterações nesta Política</h2>
            <p className="text-gray-700 mb-6">
              Reservamo-nos o direito de atualizar esta Política de Privacidade periodicamente. As alterações serão 
              publicadas nesta página com data de atualização.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-6">9. Contato</h2>
            <p className="text-gray-700 mb-4">
              Para questões relacionadas a esta Política de Privacidade ou para exercer seus direitos, entre em contato conosco:
            </p>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-700 mb-2">
                <strong>Academia de Letras do Triângulo Mineiro</strong>
              </p>
              <p className="text-gray-700 mb-2">
                Rua Lauro Borges 347, Bairro Estados Unidos<br />
                Uberaba - MG
              </p>
              <p className="text-gray-700 mb-2">
                Telefone: (34) 33333-3333
              </p>
              <p className="text-gray-700">
                E-mail: contato@altm.org.br
              </p>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-500">
                Última atualização: {new Date().toLocaleDateString('pt-BR')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

