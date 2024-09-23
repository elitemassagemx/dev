// Clase base para componentes
class Component {
    constructor(props = {}) {
        this.props = props;
        this.state = {};
    }

    setState(newState) {
        this.state = { ...this.state, ...newState };
        this.render();
    }

    render() {
        // Método a ser sobrescrito por las subclases
        throw new Error('El método render debe ser implementado');
    }
}

// Componente SugerenciasParaTi
class SugerenciasParaTi extends Component {
    constructor(props) {
        super(props);
        this.state = {
            sugerencias: [
                { nombre: 'Mary Aguilar', usuario: 'maryaguilar0', imagen: 'https://via.placeholder.com/100' },
                { nombre: 'Vanessa Villeg...', usuario: 'vanahi19', imagen: 'https://via.placeholder.com/100' },
            ]
        };
    }

    seguirUsuario(usuario) {
        console.log(`Siguiendo a ${usuario}`);
        // Aquí iría la lógica para seguir al usuario
    }

    render() {
        const container = document.createElement('div');
        container.className = 'sugerencias-container';
        
        const title = document.createElement('h2');
        title.textContent = 'Sugerencias para ti';
        container.appendChild(title);

        this.state.sugerencias.forEach(sugerencia => {
            const item = document.createElement('div');
            item.className = 'sugerencia-item';
            item.innerHTML = `
                <div class="sugerencia-info">
                    <img src="${sugerencia.imagen}" alt="${sugerencia.nombre}" class="sugerencia-avatar">
                    <div>
                        <div class="sugerencia-nombre">${sugerencia.nombre}</div>
                        <div class="sugerencia-usuario">${sugerencia.usuario}</div>
                    </div>
                </div>
                <button class="sugerencia-seguir">Seguir</button>
            `;
            const seguirButton = item.querySelector('.sugerencia-seguir');
            seguirButton.addEventListener('click', () => this.seguirUsuario(sugerencia.usuario));
            container.appendChild(item);
        });

        return container;
    }
}

// Componente ServiceCard
class ServiceCard extends Component {
    constructor(props) {
        super(props);
    }

    reservar() {
        console.log(`Reservando ${this.props.title}`);
        // Aquí iría la lógica para reservar el servicio
    }

    mostrarInfo() {
        console.log(`Mostrando información de ${this.props.title}`);
        // Aquí iría la lógica para mostrar más información
    }

    render() {
        const card = document.createElement('div');
        card.className = 'service-card';
        card.innerHTML = `
            <div class="service-card-content">
                <h3 class="service-card-title">${this.props.title}</h3>
                <p class="service-card-description">${this.props.description}</p>
            </div>
            <div class="service-card-benefits">
                <h4>Beneficios:</h4>
                <ul>
                    ${this.props.benefits.map(benefit => `<li>${benefit}</li>`).join('')}
                </ul>
            </div>
            <div class="service-card-duration">
                <p>Duración: ${this.props.duration}</p>
            </div>
            <div class="service-card-buttons">
                <button class="service-card-button service-card-button-reserve">Reservar</button>
                <button class="service-card-button service-card-button-info">Saber más</button>
            </div>
        `;

        const reserveButton = card.querySelector('.service-card-button-reserve');
        reserveButton.addEventListener('click', () => this.reservar());

        const infoButton = card.querySelector('.service-card-button-info');
        infoButton.addEventListener('click', () => this.mostrarInfo());

        return card;
    }
}

// Componente FixedBottomBar
class FixedBottomBar extends Component {


    render() {
        const bar = document.createElement('nav');
        bar.className = 'fixed-bottom-bar';
        bar.innerHTML = `
            <ul>
                ${this.state.items.map(item => `
                    <li>
                        <a href="${item.href}">
                            <i class="fas fa-${item.icon}"></i>
                            <span>${item.text}</span>
                        </a>
                    </li>
                `).join('')}
            </ul>
        `;
        return bar;
    }
}

// Función principal para inicializar los componentes
function initComponents() {
    const root = document.getElementById('react-root');
    if (!root) {
        console.error('Element with id "react-root" not found');
        return;
    }

    const sugerencias = new SugerenciasParaTi();
    root.appendChild(sugerencias.render());

    const serviceCardData = {
        title: "Masaje Relajante",
        description: "Un masaje suave para aliviar el estrés y la tensión.",
        benefits: ["Reduce el estrés", "Mejora la circulación", "Alivia dolores musculares"],
        duration: "60 minutos"
    };
    const serviceCard = new ServiceCard(serviceCardData);
    root.appendChild(serviceCard.render());

    const bottomBar = new FixedBottomBar();
    document.body.appendChild(bottomBar.render());
}

// Inicializar los componentes cuando el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', initComponents);
