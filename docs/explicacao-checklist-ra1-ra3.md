# Explicação do Checklist por Item

Este arquivo reúne a defesa de cada item do checklist avaliado nesta etapa, com foco no que o projeto realmente usa hoje no código.

## RA1 - Utilizar Frameworks CSS para estilização e layouts responsivos

### ID 02 - Layout responsivo com Framework CSS

1. O Conceito
   - Estou usando Bootstrap como estrutura pronta de layout para montar cabeçalho, navegação, alinhamento e espaçamentos sem escrever tudo do zero.
2. A Motivação
   - Isso resolve o problema de repetir o mesmo comportamento em várias telas. O cabeçalho e o corpo já nascem com comportamento responsivo em [pages/portfolio/portfolio.html](../pages/portfolio/portfolio.html) e em [pages/market/conectar_carteira.html](../pages/market/conectar_carteira.html).
3. A Anatomia do Código
   - As classes container-fluid, d-flex, align-items-center, justify-content-between, d-none d-lg-flex e px-md-4 são utilitários do Bootstrap que montam a estrutura flexível e controlam quando elementos aparecem ou somem por breakpoint.
4. O Teste do "E se eu tirar?"
   - Se eu remover essas classes, o topo perde alinhamento, o menu deixa de se adaptar ao tamanho da tela e a hierarquia visual fica espremida no mobile.

### ID 03 - Layout responsivo com CSS puro

1. O Conceito
   - Aqui eu não dependo só do framework; escrevo minhas próprias regras com Flexbox, Grid e media queries para controlar o desenho da página.
2. A Motivação
   - Isso foi usado para criar blocos mais autorais, como o hero-grid em [pages/portfolio/portfolio.html](../pages/portfolio/portfolio.html), onde o layout vira duas colunas no desktop e uma coluna no tablet/celular.
3. A Anatomia do Código
   - A regra display: grid combinada com grid-template-columns e a media query faz o navegador reorganizar os blocos automaticamente conforme a largura disponível.
4. O Teste do "E se eu tirar?"
   - Se eu apagar esse CSS, a página perde a composição própria e volta a depender só do empilhamento padrão, que fica menos elegante e menos controlado.

### ID 04 - Componentes prontos do framework e JS do framework

1. O Conceito
   - Eu aproveito peças prontas do Bootstrap, como cards, botões, navegação e componentes interativos, em vez de inventar tudo na mão.
2. A Motivação
   - Isso acelera a entrega e mantém consistência visual. O projeto já carrega o Bootstrap na folha e no script em [pages/market/conectar_carteira.html](../pages/market/conectar_carteira.html) e documenta essa escolha em [README.md](../README.md).
3. A Anatomia do Código
   - O CSS do Bootstrap entrega o visual padrão dos componentes, e o bootstrap.bundle.min.js habilita a camada JavaScript de plugins como modal, dropdown e tooltip quando eles forem usados no HTML.
4. O Teste do "E se eu tirar?"
   - Se eu remover o framework, os componentes perdem o estilo padronizado e qualquer interação dependente do bundle deixa de funcionar.

### ID 05 - Layout fluido com unidades relativas

1. O Conceito
   - Em vez de usar só pixels fixos, eu uso rem, %, vw, vh e em para deixar a interface adaptar melhor em qualquer tela.
2. A Motivação
   - Isso evita travar a composição em pixels duros; no projeto aparecem medidas relativas em títulos e espaçamentos em [pages/portfolio/portfolio.html](../pages/portfolio/portfolio.html) e também um tamanho fluido de título em [pages/portfolio/portfolio.html](../pages/portfolio/portfolio.html).
3. A Anatomia do Código
   - Quando eu escrevo algo como font-size: clamp(2rem, 5vw, 3.2rem), o navegador escolhe um tamanho mínimo, um tamanho ideal baseado na viewport e um teto máximo.
4. O Teste do "E se eu tirar?"
   - Se eu trocar essas unidades por pixels fixos, o texto e os blocos deixam de se adaptar direito ao celular e ao monitor grande, e o layout começa a parecer travado.

### ID 07 - Uso de Sass com variáveis, mixins ou funções

1. O Conceito
   - Sass é a camada que me deixa programar CSS com mais organização, usando variáveis, trechos reutilizáveis e importação modular.
2. A Motivação
   - Eu usei isso para não repetir cores e padrões visuais em várias páginas; o ponto de entrada está em [scss/main.scss](../scss/main.scss), com variáveis em [scss/_variables.scss](../scss/_variables.scss) e mixins em [scss/_mixins.scss](../scss/_mixins.scss).
3. A Anatomia do Código
   - O @use traz os arquivos de apoio, o @include injeta o código do mixin dentro da classe final e os partials como [scss/components/_buttons.scss](../scss/components/_buttons.scss) transformam a regra reutilizável em classes concretas como btn-cs e btn-cs-outline.
4. O Teste do "E se eu tirar?"
   - Se eu apagar essa camada, os botões e blocos perdem padronização, as cores deixam de ser centralizadas e o build de CSS perde a modularidade que facilita manutenção.

### ID 08 - Tipografia responsiva

1. O Conceito
   - Eu faço títulos e textos mudarem de tamanho conforme a tela para manter leitura boa no celular e presença visual no desktop.
2. A Motivação
   - Isso evita que um título fique enorme demais no mobile ou pequeno demais em monitores grandes; o projeto usa clamp em [pages/portfolio/portfolio.html](../pages/portfolio/portfolio.html), em [pages/settings/conf_preferencias.html](../pages/settings/conf_preferencias.html) e em [pages/transactions/transacoes.html](../pages/transactions/transacoes.html).
3. A Anatomia do Código
   - A sintaxe clamp(min, ideal, max) diz ao navegador para escolher um valor flexível dentro de limites seguros, e as media queries mobile first ajustam a hierarquia quando a largura cruza os breakpoints.
4. O Teste do "E se eu tirar?"
   - Se eu remover o clamp ou as media queries, a tipografia perde equilíbrio: no celular pode sobrar texto, no desktop pode faltar presença visual e a leitura fica menos confortável.

### ID 09 - Responsividade de imagens

1. O Conceito
   - A ideia é fazer a imagem caber no espaço certo sem deformar, cortando ou esticando de forma feia.
2. A Motivação
   - No arquivo de conexão de carteira, as miniaturas dos provedores aparecem com uma classe de encaixe visual em [pages/market/conectar_carteira.html](../pages/market/conectar_carteira.html).
3. A Anatomia do Código
   - O HTML usa img com object-contain na marcação, mas eu não encontrei uma regra CSS local explícita com object-fit ou um bloco de imagem mais robusto para sustentar isso em todos os casos.
4. O Teste do "E se eu tirar?"
   - Se eu tirar essa classe de encaixe, as miniaturas podem perder o equilíbrio dentro do cartão; e, como a implementação não está centralizada no CSS local, em alguns cenários a mudança pode ser pequena demais para notar.

### ID 10 - Otimização de imagens com WebP e carregamento adaptativo

1. O Conceito
   - Aqui a ideia seria servir a imagem mais leve possível e deixar o navegador escolher a melhor versão para cada tela e densidade.
2. A Motivação
   - Isso reduz peso de página e melhora a experiência, principalmente em telas menores ou conexões mais lentas; só que eu não encontrei no repositório uso explícito de WebP, srcset ou picture.
3. A Anatomia do Código
   - As imagens que eu vi em [pages/market/conectar_carteira.html](../pages/market/conectar_carteira.html) usam uma única URL remota, então o navegador sempre baixa uma versão só, sem seleção adaptativa.
4. O Teste do "E se eu tirar?"
   - Se eu apagar a URL da imagem, o ícone some; e como não há fallback moderno visível no código atual, o projeto ainda não ganha a economia de banda que esse recurso deveria trazer.

## RA3 - Aplicar ferramentas para otimização do processo de desenvolvimento

### ID 15 - Configuração com Node.js e NPM

1. O Conceito
   - Node e NPM são o motor que organiza dependências e scripts do projeto.
2. A Motivação
   - Eu preciso disso para instalar Bootstrap, Sass, ESLint e Prettier e para rodar tarefas como compilação de CSS e formatação; isso está centralizado em [package.json](../package.json).
3. A Anatomia do Código
   - Os scripts build:css, dev:css, lint e format chamam as ferramentas do ecossistema, e as dependências bootstrap, sass, eslint, prettier e gh-pages mostram que o projeto realmente depende do ambiente Node para trabalhar.
4. O Teste do "E se eu tirar?"
   - Se eu remover o package.json ou não instalar as dependências, o build de CSS quebra, o lint não roda e as páginas deixam de encontrar os arquivos gerados em node_modules e assets.

### ID 16 - Versionamento com Git/GitHub

1. O Conceito
   - Estou usando Git para controlar histórico e GitHub para versionar e publicar o projeto de forma organizada.
2. A Motivação
   - Isso serve para não misturar arquivos gerados com código-fonte e para manter o projeto colaborativo e rastreável; a exclusão de node_modules está em [.gitignore](../.gitignore) e o repositório já está na branch main.
3. A Anatomia do Código
   - O .gitignore evita que dependências instaladas entrem no controle de versão, e o endereço remoto do repositório está declarado em [package.json](../package.json).
4. O Teste do "E se eu tirar?"
   - Se eu apagar o .gitignore, o node_modules tende a poluir o repositório; se eu perder a disciplina de branch, fica mais difícil revisar mudanças e acompanhar o histórico com clareza.

### ID 17 - README padronizado

1. O Conceito
   - O README é a ficha do projeto, onde eu explico o que ele faz, como está organizado e como rodar.
2. A Motivação
   - Isso resolve o problema de alguém abrir o repositório sem contexto; em [README.md](../README.md) eu tenho descrição, funcionalidades, tecnologias, estrutura e checklist da disciplina.
3. A Anatomia do Código
   - O arquivo já traz seções próprias para framework, API, estrutura, comandos úteis e checklist RA1/RA3, mas os itens ainda aparecem em aberto no estado atual do documento.
4. O Teste do "E se eu tirar?"
   - Se eu apagar ou desorganizar esse arquivo, o projeto perde a documentação de entrada e fica muito mais difícil entender o que já foi feito e o que ainda falta validar.

### ID 18 - Organização modular do projeto

1. O Conceito
   - Eu separo o projeto por responsabilidade, deixando páginas, estilos, scripts e documentação em pastas diferentes.
2. A Motivação
   - Isso evita virar uma pasta de tudo e facilita manutenção; a estrutura está descrita em [docs/structure.md](../docs/structure.md) e refletida por pastas como pages, assets, scripts e scss.
3. A Anatomia do Código
   - As páginas ficam organizadas por domínio, os estilos são divididos em partials SCSS e concentrados em main.scss, e os recursos estáticos vão para assets/css, assets/img e assets/js.
4. O Teste do "E se eu tirar?"
   - Se eu juntar tudo em um único lugar, a manutenção fica mais lenta, o reuso cai e fica bem mais fácil quebrar algo ao alterar uma tela específica.

### ID 19 - ESLint e Prettier

1. O Conceito
   - Estou usando ferramentas automáticas para padronizar código e pegar erros de estilo ou de escrita antes de virar bagunça.
2. A Motivação
   - Isso ajuda a manter o JavaScript consistente e o projeto previsível; o ESLint está configurado em [.eslintrc.json](../.eslintrc.json) e o Prettier está em [.prettierrc](../.prettierrc), com scripts de execução em [package.json](../package.json).
3. A Anatomia do Código
   - O ESLint recomenda regras como no-unused-vars e o Prettier define como a formatação sai, com aspas simples, vírgula final es5 e largura de linha de 100 caracteres.
4. O Teste do "E se eu tirar?"
   - Se eu remover essas configurações, o código passa a aceitar estilos diferentes em cada arquivo e o ganho de padronização desaparece.
