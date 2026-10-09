/* Agosto Lilás — Mulher Segura
 * Comportamentos e interações da aplicação.
 */
const names = {
            home: 'Mulher Segura · Agosto Lilás',
            ajuda: 'Preciso de ajuda',
            denuncia: 'Denunciar agressão',
            delegacias: 'Delegacias próximas',
            historias: 'Histórias que inspiram',
            direitos: 'Meus direitos',
            chat: 'Falar com assistente'
        };

        function go(id) {
            document.querySelectorAll('.screen').forEach(x => x.classList.remove('active'));
            document.getElementById(id).classList.add('active');
            document.getElementById('title').textContent = names[id];
            document.querySelectorAll('.nav button').forEach(x => {
                const current = x.dataset.s === id;
                x.classList.toggle('on', current);
                if (current) x.setAttribute('aria-current', 'page');
                else x.removeAttribute('aria-current');
            });
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }

        function menu() {
            const n = document.getElementById('nav');
            const button = document.querySelector('.mobile-menu');
            const open = n.classList.toggle('mobile-open');
            button?.setAttribute('aria-expanded', String(open));
            button?.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
        }

        function exitNow() { window.location.replace('https://www.google.com'); }

        function denStep(n) {
            [1, 2, 3].forEach(i => {
                document.getElementById('d' + i).hidden = i !== n;
                document.getElementById('s' + i).classList.toggle('on', i <= n);
            });
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }

        /* ===== Relatos (ilustrativos, nomes fictícios) ===== */
        const stories = [
            { n: 'Célia', i: 'C', ctx: '52 anos · mãe de três', t: 'Eu tinha vergonha de contar. Achava que era culpa minha, que eu tinha feito algo pra merecer. Quando liguei no 180, uma mulher me ouviu sem me julgar. Foi a primeira vez em anos que eu dormi em paz.' },
            { n: 'Dandara', i: 'D', ctx: '28 anos · buscou apoio pelo 180', t: 'Eu achava que ninguém ia acreditar em mim. Fui acolhida com respeito e, pela primeira vez em muito tempo, me senti ouvida. Hoje retomei meus estudos.' },
            { n: 'Rosângela', i: 'R', ctx: '41 anos · mãe de duas filhas', t: 'Minha filha me viu chorando e disse: "mãe, a gente pode pedir ajuda". Foi ela quem me deu coragem. Hoje a nossa casa é um lugar de paz.' },
            { n: 'Jaqueline', i: 'J', ctx: '23 anos · recomeçando', t: 'Uma amiga me escutou sem julgar e me mostrou que existiam caminhos. Dar o primeiro passo foi o mais difícil, mas não precisei dar sozinha.' },
            { n: 'Neusa', i: 'N', ctx: '37 anos · voltou a trabalhar', t: 'Durante muito tempo eu me senti pequena. Com apoio, voltei a confiar nas minhas decisões. Hoje eu tenho meu trabalho, meu dinheiro e minha voz.' },
            { n: 'Dona Ivone', i: 'I', ctx: '58 anos · nunca é tarde', t: 'Achei que era tarde demais para mim. Não era. Aos 58 anos descobri que eu também tinha direito a uma vida tranquila.' },
            { n: 'Beatriz', i: 'B', ctx: '30 anos · fez um curso novo', t: 'No começo eu só queria sumir. Aos poucos, com ajuda de profissionais e de quem me ama, fui reencontrando quem eu era. Hoje faço um curso que sempre sonhei.' },
            { n: 'Tereza', i: 'T', ctx: '26 anos · rede de apoio', t: 'Eu não sabia que existiam tantos lugares para me ajudar. Quando liguei, fui tratada com cuidado. Saber disso teria me poupado muito medo.' },
            { n: 'Conceição', i: 'C', ctx: '45 anos · ajudando outras mulheres', t: 'Hoje, quando uma amiga me conta que está passando por algo difícil, eu digo o que gostaria de ter ouvido: você não está sozinha e não tem culpa.' }
        ];

        function renderStories() {
            document.getElementById('slides').innerHTML = stories.map((s, k) => `
                <div class="slide${k === 0 ? ' on' : ''}" role="group" aria-roledescription="slide" aria-label="Relato ${k + 1} de ${stories.length}">
                    <blockquote>${s.t}</blockquote>
                    <cite>— ${s.n}, ${s.ctx}</cite>
                </div>`).join('');
            document.getElementById('dots').innerHTML = stories.map((s, k) =>
                `<button class="dot${k === 0 ? ' on' : ''}" data-action="showSlide" data-action-arg="${k}" aria-label="Ir para o relato ${k + 1}" aria-current="${k === 0 ? 'true' : 'false'}"></button>`).join('');
            document.getElementById('storygrid').innerHTML = stories.map(s => `
                <div class="story">
                    <div class="avatar" aria-hidden="true">${s.i}</div>
                    <p>${s.t}</p>
                    <footer><b>${s.n}</b>${s.ctx}</footer>
                </div>`).join('');
        }

        let cur = 0, timer = null;
        const total = () => document.querySelectorAll('.slide').length;

        function showSlide(n) {
            const slides = [...document.querySelectorAll('#carousel .slide')];
            if (!slides.length) return;
            const previousIndex = cur;
            const nextIndex = (n + slides.length) % slides.length;

            // Mantém o relato anterior visível durante a saída, para que exista
            // um crossfade real em vez de trocar o conteúdo de forma instantânea.
            if (nextIndex !== previousIndex) {
                const previous = slides[previousIndex];
                if (previous) {
                    previous.classList.remove('is-exiting', 'is-fading-out');
                    previous.classList.add('is-exiting');
                    void previous.offsetWidth;
                    previous.classList.add('is-fading-out');
                    window.setTimeout(() => {
                        previous.classList.remove('is-exiting', 'is-fading-out');
                    }, 1450);
                }
            }

            cur = nextIndex;
            slides.forEach((el, k) => {
                el.classList.toggle('on', k === cur);
                const quote = el.querySelector('blockquote');
                if (k === cur && quote) {
                    quote.classList.remove('quote-enter-now');
                    void quote.offsetWidth;
                    quote.classList.add('quote-enter-now');
                } else if (quote) {
                    quote.classList.remove('quote-enter-now');
                }
            });
            document.querySelectorAll('.dot').forEach((el, k) => {
                el.classList.toggle('on', k === cur);
                el.setAttribute('aria-current', k === cur ? 'true' : 'false');
            });
            restartTimer();
        }

        function slideBy(d) { showSlide(cur + d); }

        function restartTimer() {
            clearInterval(timer);
            // A preferência por movimento reduzido remove transições, mas não impede
            // que os relatos avancem automaticamente.
            const progress = document.getElementById('carousel-progress-bar');
            if (progress) {
                progress.classList.remove('running');
                void progress.offsetWidth;
                progress.classList.add('running');
            }
            timer = setInterval(() => showSlide(cur + 1), 6000);
        }

        const car = document.getElementById('carousel');
        // O carrossel continua avançando automaticamente mesmo após clicar nas setas.

        renderStories();
        restartTimer();

        /* ===== Delegacias ===== */
        const ddms = [
            ['1ª DDM — Casa da Mulher Brasileira', 'Rua Vieira Ravasco, 26 — Cambuci, São Paulo — SP', 1, '1ª DDM Casa da Mulher Brasileira Rua Vieira Ravasco 26 São Paulo SP'],
            ['2ª DDM — Vila Clementino', 'Avenida Onze de Junho, 89 — Vila Clementino, São Paulo — SP', 1, '2ª DDM Avenida Onze de Junho 89 São Paulo SP'],
            ['3ª DDM — Jaguaré', 'Avenida Corifeu de Azevedo Marques, 4300 — Jaguaré, São Paulo — SP', 0, '3ª DDM Avenida Corifeu de Azevedo Marques 4300 São Paulo SP'],
            ['4ª DDM — Freguesia do Ó', 'Avenida Itaberaba, 731 — Freguesia do Ó, São Paulo — SP', 1, '4ª DDM Avenida Itaberaba 731 São Paulo SP'],
            ['7ª DDM — Itaquera', 'Rua Sábado D\'Ângelo, 46 — Itaquera, São Paulo — SP', 1, '7ª DDM Rua Sábado D Angelo 46 São Paulo SP'],
            ['8ª DDM — Jardim Marília', 'Avenida Osvaldo Valle Cordeiro, 190 — Jardim Marília, São Paulo — SP', 1, '8ª DDM Avenida Osvaldo Valle Cordeiro 190 São Paulo SP'],
            ['9ª DDM — Pirituba', 'Avenida Menotti Laudisio, 286 — Pirituba, São Paulo — SP', 0, '9ª DDM Avenida Menotti Laudisio 286 São Paulo SP']
        ];

        let pos = null;

        function maps(q) {
            return 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(q);
        }

        function route(q) {
            return pos ? 'https://www.google.com/maps/dir/?api=1&origin=' + pos.lat + ',' + pos.lon + '&destination=' + encodeURIComponent(q) : maps(q);
        }

        function render() {
            document.getElementById('places').innerHTML = ddms.map(x => `
                <div class="place">
                    <div class="placehead">
                        <h3>${x[0]}</h3>
                        ${x[2] ? '<span class="tag">24h</span>' : ''}
                    </div>
                    <p>${x[1]}</p>
                    <a target="_blank" rel="noopener" href="${maps(x[3])}">Google Maps</a>
                    <a target="_blank" rel="noopener" href="${route(x[3])}">Traçar rota</a>
                </div>
            `).join('');
        }

        function locate() {
            if (!navigator.geolocation) {
                alert('Seu navegador não oferece localização. Você pode pesquisar manualmente.');
                return;
            }
            navigator.geolocation.getCurrentPosition(
                p => {
                    pos = { lat: p.coords.latitude, lon: p.coords.longitude };
                    document.getElementById('map').src = 'https://www.google.com/maps?q=' + pos.lat + ',' + pos.lon + '%20Delegacia%20da%20Mulher&output=embed';
                    render();
                },
                () => alert('Não foi possível acessar sua localização. Verifique a permissão do navegador e tente novamente.')
            );
        }

        function mapSearch() {
            const q = document.getElementById('search').value.trim() || 'Delegacia da Mulher';
            document.getElementById('map').src = 'https://www.google.com/maps?q=' + encodeURIComponent(q + ' Delegacia da Mulher') + '&output=embed';
            window.open(maps(q + ' Delegacia da Mulher'), '_blank', 'noopener');
        }

        render();

        /* ===== Chat ===== */
        const rules = [
            [['denunciar', 'denúncia', 'denuncia', 'agressão', 'agressao'], 'Você pode denunciar em São Paulo pelo 181, de forma anônima, ou pelo Web Denúncia. Para violência contra a mulher em todo o Brasil, o Ligue 180 também recebe e encaminha denúncias.'],
            [['181', 'anônima', 'anonima', 'sigilo'], 'O 181 é o Disque Denúncia de São Paulo. A SSP informa que a denúncia pode ser feita anonimamente e também existe o Web Denúncia.'],
            [['180', 'ligue', 'mulher'], 'O Ligue 180 é a Central de Atendimento à Mulher. É gratuito, funciona 24 horas e orienta sobre direitos, rede de atendimento e registro/encaminhamento de denúncias.'],
            [['delegacia', 'ddm', 'localização', 'localizacao', 'perto'], 'Na tela "Delegacias próximas" você pode autorizar a localização do aparelho e abrir o Google Maps para procurar uma Delegacia da Mulher perto de você.'],
            [['direito', 'lei', 'maria da penha', 'protetiva'], 'Na tela "Meus direitos" você encontra informações sobre Lei Maria da Penha, medidas protetivas, atendimento especializado e registro de ocorrência.'],
            [['medo', 'perigo', 'ameaça', 'ameaca'], 'Se estiver com medo, priorize um lugar seguro e uma pessoa de confiança. Para orientação e encaminhamento use o 180; para denúncia anônima em SP, 181.'],
            [['190', 'emergência', 'emergencia', 'urgente'], 'Em emergência imediata, ligue 190. Para orientação e acolhimento, use o 180. Para denúncia anônima em SP, 181.'],
            [['não sei', 'nao sei', 'começar', 'comecar', 'por onde'], 'Sem problema. Posso te ajudar em 3 passos: 1) você está em perigo agora? 2) quer denunciar ou só entender os direitos? 3) prefere ligar, WhatsApp ou ir presencialmente? Me diga qual passo faz sentido pra você.'],
            [['whatsapp'], 'O WhatsApp oficial do Ligue 180 é (61) 9610-0180. Você pode abrir o canal pela tela "Preciso de ajuda".'],
            [['oi', 'olá', 'ola', 'bom dia', 'boa tarde', 'boa noite'], 'Oi. 💜 Pode me perguntar sobre denúncia, 181, 180, delegacias, direitos ou medidas protetivas.']
        ];

        function answer(t) {
            t = t.toLowerCase();
            for (const r of rules) {
                if (r[0].some(k => t.includes(k))) return r[1];
            }
            return 'Posso ajudar com denúncia, 181, Ligue 180, WhatsApp 180, delegacias próximas e direitos. Me diga só o que você precisa, sem senhas ou dados pessoais.';
        }

        function add(t, c) {
            const b = document.getElementById('msgs');
            const e = document.createElement('div');
            e.className = 'msg ' + c;
            e.textContent = t;
            b.appendChild(e);
            b.scrollTop = b.scrollHeight;
        }

        function send() {
            const i = document.getElementById('chatin');
            const t = i.value.trim();
            if (!t) return;
            add(t, 'user');
            i.value = '';
            setTimeout(() => add(answer(t), 'bot'), 400);
        }

        function quick(t) {
            document.getElementById('chatin').value = t;
            send();
        }

        function clearChat() {
            document.getElementById('msgs').innerHTML = '<div class="msg bot">Chat limpo. 💜 Como posso te orientar?</div>';
        }

        /* ===== Botão voltar ao topo ===== */
        const toTop = document.getElementById('toTop');
        window.addEventListener('scroll', () => {
            toTop.classList.toggle('show', window.scrollY > 400);
        }, { passive: true });


/* Interações delegadas e acessibilidade do menu/chat. */
document.addEventListener('click', event => {
 const control = event.target.closest('[data-action]'); if (!control) return;
 const action = control.dataset.action, raw = control.dataset.actionArg;
 const arg = raw !== undefined && String(Number(raw)) === raw ? Number(raw) : raw;
 if (control.getAttribute('href') === '#') event.preventDefault();
 if (action === 'scroll-top') { window.scrollTo({top:0,behavior:'smooth'}); return; }
 const fn = window[action]; if (typeof fn === 'function') raw === undefined ? fn() : fn(arg);
});
document.getElementById('chatin')?.addEventListener('keydown', event => { if (event.key === 'Enter') { event.preventDefault(); send(); } });
document.querySelectorAll('.nav [data-action]').forEach(control => control.addEventListener('click', () => {
 document.querySelector('.mobile-menu')?.setAttribute('aria-expanded','false');
 document.querySelector('.mobile-menu')?.setAttribute('aria-label','Abrir menu');
 document.getElementById('nav')?.classList.remove('mobile-open');
}));
