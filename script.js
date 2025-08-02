//Função para formatar data - deixando a data da API mais legível
function formatarData(iso) {
    const data = new Date(iso);
    const dia = String(data.getDate()).padStart(2, '0');
    const meses = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
    const mes = meses[data.getMonth()];
    const ano = data.getFullYear();

    return `${dia} de ${mes} de ${ano}`;
}

const input = document.querySelector('.inputNome');
const btn = document.querySelector('.btnPesquisar');
const semRetorno = document.querySelector('.SemRetorno');

function mostrarCard(data) {
    semRetorno.style.display = 'none';

    let card = document.querySelector('.cardRetorno');
    if (!card) {
        card = document.createElement('div');
        card.className = 'cardRetorno';
        const searchBar = document.querySelector('.searchBar');
        searchBar.insertAdjacentElement('afterend', card);
    }

    const nome = data.name || 'Nome Indisponível';
    const userNome = data.login;
    const bio = data.bio || 'Sem bio disponível.';
    const desde = data.created_at ? formatarData(data.created_at) : 'Data não disponível';
    const perfilUrl = data.html_url;
    const avatar = data.avatar_url || '';
    const repos = data.public_repos ?? '—';
    const seguidores = data.followers ?? '—';
    const seguindo = data.following ?? '—';

    card.innerHTML = `
        <div class="nomeFoto">
            <img 
                src="${avatar}" 
                alt="Imagem do Perfil"
                class="imgPerfil">
            <div class="userNome">
                <h2 class="Nome">${nome}</h2>
                <a href="${perfilUrl}" class="userLink" target="_blank">
                    <h4 class="user">${userNome}</h4>
                </a>
            </div>
        </div>

        <div class="BioDesde">
            <h4 class="bio">${bio}</h4>
            <h4 class="desde">Desde ${desde}</h4>
        </div>

        <div class="dados">
            <div class="dado">
                <h3 class="dadoTitle">Repositórios Públicos</h3>
                <h1 class="dadoNumero">${repos}</h1>
            </div>

            <div class="dado">
                <h3 class="dadoTitle">Seguidores</h3>
                <h1 class="dadoNumero">${seguidores}</h1>
            </div>

            <div class="dado">
                <h3 class="dadoTitle">Seguindo</h3>
                <h1 class="dadoNumero">${seguindo}</h1>
            </div>
        </div>
    `;
}

function mostrarSemRetorno(mensagem = 'Nada a exibir...') {
    const card = document.querySelector('.cardRetorno');
    if (card) {
        card.remove();
    }

    semRetorno.style.display = 'flex';

    const texto = document.querySelector('.SemRetornoTexto');
    if (texto) {
        texto.textContent = mensagem;
    }
}

async function buscarUsuario() {
  const username = input.value.trim();
  if (!username) {
    mostrarSemRetorno('Digite um nome de usuário.');
    return;
  }

  btn.disabled = true;
  const originalTexto = btn.querySelector('.btnPesquisarTxt').textContent;
  btn.querySelector('.btnPesquisarTxt').textContent = 'Buscando...';

  try {
    const url = `https://api.github.com/users/${encodeURIComponent(username)}`;
    const res = await fetch(url);

    if (res.status === 404) {
      mostrarSemRetorno('Usuário não encontrado.');
    } else if (!res.ok) {
      mostrarSemRetorno(`Erro HTTP: ${res.status} ${res.statusText}`);
    } else {
      const data = await res.json();
      mostrarCard(data);
    }
  } catch (e) {
    console.error('Fetch falhou:', e);
    //Normalmente é TypeError em falhas de rede
    if (e instanceof TypeError) {
      mostrarSemRetorno('Erro de rede. Verifique sua conexão ou extensões bloqueando a requisição.');
    } else {
      mostrarSemRetorno('Erro inesperado.');
    }
  } finally {
    btn.disabled = false;
    btn.querySelector('.btnPesquisarTxt').textContent = originalTexto;
  }
}


btn.addEventListener('click', buscarUsuario);
input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') buscarUsuario();
});

// inicial: garante que o "SemRetorno" está visível
mostrarSemRetorno();
