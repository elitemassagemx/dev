// Configuración global
const CONFIG = {
    BASE_URL: "https://raw.githubusercontent.com/elitemassagemx/Home/main/ICONOS/",
    ITEMS_PER_PAGE: 3,
    WHATSAPP_NUMBER: "5215640020305"
};

// Estado global de la aplicación
const state = {
    currentPage: 1,
    currentCategory: 'individual',
    totalPages: 1,
    language: 'es',
    services: null,
    packages: null
};

// Módulo de Utilidades
const Utils = {
    createElement: (tag, className, innerHTML) => {
        const element = document.createElement(tag);
        if (className) element.className = className;
        if (innerHTML) element.innerHTML = innerHTML;
        return element;
    },
    
    showNotification: (message) => {
        const toast = document.getElementById('toast');
        toast.querySelector('#desc').textContent = message;
        toast.className = 'show';
        setTimeout(() => { toast.className = toast.className.replace('show', ''); }, 5000);
    }
};

// Módulo de Comunicación
const CommunicationModule = {
    sendWhatsAppMessage: (action, serviceTitle) => {
        const message = encodeURIComponent(`Hola! Quiero ${action} un ${serviceTitle}`);
        const url = `https://wa.me/${CONFIG.WHATSAPP_NUMBER}?text=${message}`;
        window.open(url, '_blank');
    },

    setupContactForm: () => {
        const form = document.getElementById('contact-form');
        if (form) {
            form.innerHTML = `
                <h2>Contáctanos</h2>
                <input type="text" id="name" name="name" placeholder="Tu nombre" required>
                <input type="email" id="email" name="email" placeholder="Tu email" required>
                <textarea id="message" name="message" placeholder="Tu mensaje aquí" required></textarea>
                <button type="submit">Enviar</button>
            `;
            form.addEventListener('submit', function(e) {
                e.preventDefault();
                Utils.showNotification('Mensaje enviado con éxito');
                form.reset();
            });
        }
    }
};

// Módulo de Beneficios Destacados
const BeneficiosModule = {
    renderBeneficiosDestacados: () => {
        const beneficiosContainer = document.querySelector('.sugerencias-container');
        if (!beneficiosContainer) return;

        const beneficios = [
            { name: "Reducción de estrés", icon: "benefits-icon1.png" },
            { name: "Mejora circulación", icon: "ccirculacion.png" },
            { name: "Alivio dolor muscular", icon: "sqpierna.png" },
            { name: "Hidratación de la piel", icon: "chidratacion.png" },
            { name: "Mejora energía vital", icon: "benefits-icon3.png" }
        ];

        beneficiosContainer.innerHTML = '';
        beneficios.forEach(beneficio => {
            const beneficioElement = Utils.createElement('div', 'sugerencia-item');
            beneficioElement.innerHTML = `
                <img src="${CONFIG.BASE_URL}${beneficio.icon}" alt="${beneficio.name}" class="sugerencia-icon">
                <p>${beneficio.name}</p>
            `;
            beneficiosContainer.appendChild(beneficioElement);
        });
    }
};

// Módulo de Servicios
const ServicesModule = {
    loadServices: async () => {
        try {
            const response = await fetch('data.json');
            if (!response.ok) {
                throw new Error('No se pudo cargar el archivo data.json');
            }
            const data = await response.json();
            state.services = data.services || {};
            state.packages = data.services.paquetes || [];
            state.currentCategory = Object.keys(state.services)[0] || '';
            ServicesModule.renderServices();
            PackagesModule.renderPackages();
        } catch (error) {
            console.error('Error al cargar los servicios:', error);
            Utils.showNotification('Error al cargar los servicios. Por favor, intenta de nuevo más tarde.');
        }
    },

    renderServices: () => {
        const servicesList = document.getElementById('services-list');
        if (!servicesList) return;
        servicesList.innerHTML = '';
        const currentServices = state.services[state.currentCategory] || [];
        const startIndex = (state.currentPage - 1) * CONFIG.ITEMS_PER_PAGE;
        const endIndex = startIndex + CONFIG.ITEMS_PER_PAGE;
        const servicesToRender = currentServices.slice(startIndex, endIndex);
        servicesToRender.forEach(service => {
            const serviceElement = ServicesModule.createServiceElement(service);
            servicesList.appendChild(serviceElement);
        });
        PaginationModule.updatePagination();
    },

    createServiceElement: (service) => {
        const serviceElement = Utils.createElement('div', 'service-item');
        serviceElement.innerHTML = `
            <h3>${service.title}</h3>
            <p>${service.description}</p>
            <div class="service-benefits">
                ${service.benefits.map((benefit, index) => `
                    <div class="service-benefit">
                        <img src="${CONFIG.BASE_URL}${service.benefitsIcons[index]}" alt="${benefit}">
                        <span>${benefit}</span>
                    </div>
                `).join('')}
            </div>
            <p class="service-duration">${service.duration}</p>
            <div class="service-buttons">
                <button class="reserve-button">Reservar</button>
                <button class="info-button">Saber más</button>
            </div>
        `;

        serviceElement.querySelector('.reserve-button').addEventListener('click', () => CommunicationModule.sendWhatsAppMessage('Reservar', service.title));
        serviceElement.querySelector('.info-button').addEventListener('click', () => UIModule.showPopup(service));

        return serviceElement;
    },

    init: () => {
        ServicesModule.loadServices();
        const categorySelector = document.querySelector('.category-selector');
        if (categorySelector) {
            categorySelector.addEventListener('click', (e) => {
                if (e.target.classList.contains('choice-chip')) {
                    state.currentCategory = e.target.dataset.category;
                    state.currentPage = 1;
                    document.querySelectorAll('.choice-chip').forEach(chip => chip.classList.remove('active'));
                    e.target.classList.add('active');
                    ServicesModule.renderServices();
                }
            });
        }
    }
};

// Módulo de Paquetes
const PackagesModule = {
    renderPackages: () => {
        const packageList = document.getElementById('package-list');
        if (!packageList) return;
        packageList.innerHTML = '';
        state.packages.forEach(pkg => {
            const packageElement = PackagesModule.createPackageElement(pkg);
            packageList.appendChild(packageElement);
        });
        PackagesModule.renderPackageBenefits();
    },

    createPackageElement: (pkg) => {
        const packageElement = Utils.createElement('div', 'package-item');
        packageElement.innerHTML = `
            <h3>${pkg.title}</h3>
            <p>${pkg.description}</p>
            <div class="package-benefits">
                ${pkg.benefits.map((benefit, index) => `
                    <div class="package-benefit">
                        <img src="${CONFIG.BASE_URL}${pkg.benefitsIcons[index]}" alt="${benefit}">
                        <span>${benefit}</span>
                    </div>
                `).join('')}
            </div>
            <p class="package-duration">${pkg.duration}</p>
            <div class="package-buttons">
                <button class="reserve-button">Reservar</button>
                <button class="info-button">Saber más</button>
            </div>
        `;

        packageElement.querySelector('.reserve-button').addEventListener('click', () => CommunicationModule.sendWhatsAppMessage('Reservar', pkg.title));
        packageElement.querySelector('.info-button').addEventListener('click', () => UIModule.showPopup(pkg));

        return packageElement;
    },

    renderPackageBenefits: () => {
        const packageBenefitsContainer = document.querySelector('.package-benefits');
        if (!packageBenefitsContainer) return;

        const allBenefits = state.packages.reduce((acc, pkg) => {
            pkg.benefits.forEach((benefit, index) => {
                if (!acc.some(b => b.name === benefit)) {
                    acc.push({ name: benefit, icon: pkg.benefitsIcons[index] });
                }
            });
            return acc;
        }, []);

        packageBenefitsContainer.innerHTML = '';
        allBenefits.forEach(benefit => {
            const benefitElement = Utils.createElement('div', 'package-benefit-item');
            benefitElement.innerHTML = `
                <img src="${CONFIG.BASE_URL}${benefit.icon}" alt="${benefit.name}" class="package-benefit-icon">
                <p>${benefit.name}</p>
            `;
            packageBenefitsContainer.appendChild(benefitElement);
        });
    },

    init: () => {
        PackagesModule.renderPackages();
    }
};

// Módulo de UI
const UIModule = {
    showPopup: (data) => {
        const popup = document.getElementById('popup');
        const popupTitle = document.getElementById('popup-title');
        const popupImage = document.getElementById('popup-image');
        const popupDescription = document.getElementById('popup-description');

        if (!popup || !popupTitle || !popupImage || !popupDescription) return;

        popupTitle.textContent = data.title;
        popupImage.src = data.image || '';
        popupImage.alt = data.title;
        popupDescription.textContent = data.popupDescription || data.description;

        popup.style.display = 'flex';
    },

    init: () => {
        const closeButton = document.querySelector('.close');
        if (closeButton) {
            closeButton.addEventListener('click', () => {
                const popup = document.getElementById('popup');
                if (popup) popup.style.display = 'none';
            });
        }
    }
};

// Módulo de Paginación
const PaginationModule = {
    updatePagination: () => {
        const paginationContainer = document.querySelector('.pagination-container');
        if (!paginationContainer) return;
        paginationContainer.innerHTML = '';
        const currentServices = state.services[state.currentCategory] || [];
        state.totalPages = Math.ceil(currentServices.length / CONFIG.ITEMS_PER_PAGE);

        for (let i = 1; i <= state.totalPages; i++) {
            const dot = Utils.createElement('div', `little-dot${i === state.currentPage ? ' active' : ''}`);
            paginationContainer.appendChild(dot);
        }
    },

    changePage: (direction) => {
        state.currentPage += direction;
        if (state.currentPage < 1) state.currentPage = state.totalPages;
        if (state.currentPage > state.totalPages) state.currentPage = 1;
        ServicesModule.renderServices();
    },

    init: () => {
        const prevButton = document.querySelector('.btn--prev');
        const nextButton = document.querySelector('.btn--next');
        if (prevButton) prevButton.addEventListener('click', () => PaginationModule.changePage(-1));
        if (nextButton) nextButton.addEventListener('click', () => PaginationModule.changePage(1));
    }
};

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
    BeneficiosModule.renderBeneficiosDestacados();
    ServicesModule.init();
    PackagesModule.init();
    UIModule.init();
    PaginationModule.init();
    CommunicationModule.setupContactForm();
});
