// ============================================
// CONFIGURACIÓN
// ============================================

const API_KEY = 'e31a5e0d76f7e37e6b18f1f23caba6cc';

const API_URL = 'https://api.openweathermap.org/data/2.5/weather';

// ============================================
// REFERENCIAS AL DOM
// ============================================

const formulario = document.getElementById('formulario');
const inputCiudad = document.getElementById('inputCiudad');
const resultado = document.getElementById('resultado');
const estado = document.getElementById('estado');

// ============================================
// FUNCIÓN PRINCIPAL: CONSULTAR CLIMA
// ============================================

async function consultarClima(ciudad) {

    estado.textContent = '🌤️ Consultando el clima...';
    resultado.classList.remove('visible');

    try {

        // Codificar la ciudad
        const ciudadCodificada = encodeURIComponent(ciudad);

        // Construir URL
        const url =
            `${API_URL}?q=${ciudadCodificada}&appid=${API_KEY}&units=metric&lang=es`;

        // Hacer petición
        const respuesta = await fetch(url);

        // Verificar respuesta
        if (!respuesta.ok) {

            if (respuesta.status === 404) {
                throw new Error('Ciudad no encontrada');

            } else if (respuesta.status === 401) {
                throw new Error('API Key inválida');

            } else {
                throw new Error(
                    'Error en la petición: ' + respuesta.status
                );
            }
        }

        // Convertir respuesta a JSON
        const datos = await respuesta.json();

        // Mostrar información
        mostrarClima(datos);

        estado.textContent = '✅ Datos actualizados correctamente.';

    } catch (error) {

        console.error('Error:', error);

        estado.textContent =
            `❌ ${error.message}. Intenta con otra ciudad.`;

        resultado.classList.remove('visible');
    }
}

// ============================================
// FUNCIÓN: MOSTRAR EL CLIMA
// ============================================

function mostrarClima(datos) {

    const ciudad = datos.name;
    const pais = datos.sys.country;

    const temperatura = Math.round(datos.main.temp);
    const sensacion = Math.round(datos.main.feels_like);

    const humedad = datos.main.humidity;
    const presion = datos.main.pressure;
    const viento = datos.wind.speed;

    const descripcion = datos.weather[0].description;
    const icono = datos.weather[0].icon;

    const iconoUrl =
        `https://openweathermap.org/img/wn/${icono}@2x.png`;

    resultado.innerHTML = `

        <div class="ciudad">${ciudad}</div>

        <div class="pais">${pais}</div>

        <img
            src="${iconoUrl}"
            alt="${descripcion}"
            class="icono-clima"
        >

        <div class="temperatura">
            ${temperatura}°C
        </div>

        <div class="descripcion">
            ${descripcion}
        </div>

        <div class="detalles">

            <div class="detalle">
                <div class="etiqueta">Sensación</div>
                <div class="valor">${sensacion}°C</div>
            </div>

            <div class="detalle">
                <div class="etiqueta">Humedad</div>
                <div class="valor">${humedad}%</div>
            </div>

            <div class="detalle">
                <div class="etiqueta">Presión</div>
                <div class="valor">${presion} hPa</div>
            </div>

            <div class="detalle">
                <div class="etiqueta">Viento</div>
                <div class="valor">${viento} m/s</div>
            </div>

        </div>
    `;

    resultado.classList.add('visible');

    cambiarFondoSegunClima(datos.weather[0].main);
}

// ============================================
// CAMBIAR FONDO SEGÚN EL CLIMA
// ============================================

function cambiarFondoSegunClima(clima) {

    document.body.classList.remove(
        'clima-soleado',
        'clima-nublado',
        'clima-lluvioso',
        'clima-nieve'
    );

    const climaLower = clima.toLowerCase();

    if (climaLower.includes('clear')) {

        document.body.classList.add('clima-soleado');

    } else if (climaLower.includes('cloud')) {

        document.body.classList.add('clima-nublado');

    } else if (
        climaLower.includes('rain') ||
        climaLower.includes('drizzle') ||
        climaLower.includes('thunderstorm')
    ) {

        document.body.classList.add('clima-lluvioso');

    } else if (climaLower.includes('snow')) {

        document.body.classList.add('clima-nieve');
    }
}

// ============================================
// EVENTO DEL FORMULARIO
// ============================================

formulario.addEventListener('submit', (e) => {

    e.preventDefault();

    const ciudad = inputCiudad.value.trim();

    if (!ciudad) {

        estado.textContent =
            '⚠️ Escribe el nombre de una ciudad.';

        return;
    }

    consultarClima(ciudad);
    guardarHistorial(ciudad)
    obtenerPronostico(ciudad)
});

// ============================================
// MENSAJE INICIAL
// ============================================

estado.textContent =
    'Escribe una ciudad y presiona "Consultar".';
    const btnUbicacion = document.getElementById('btnUbicacion');

btnUbicacion.addEventListener('click', () => {
    navigator.geolocation.getCurrentPosition(async (posicion) => {

        const lat = posicion.coords.latitude;
        const lon = posicion.coords.longitude;

        estado.textContent = '📍 Obteniendo ubicación...';

        try {
            const url = `${API_URL}?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&lang=es`;

            const respuesta = await fetch(url);
            const datos = await respuesta.json();

            mostrarClima(datos);

            estado.textContent = '✅ Clima de tu ubicación actual.';
        } catch (error) {
            estado.textContent = '❌ No se pudo obtener el clima.';
        }
    });
});
let historial = JSON.parse(localStorage.getItem('historial')) || [];

function guardarHistorial(ciudad) {

    historial = historial.filter(
        item => item.toLowerCase() !== ciudad.toLowerCase()
    );

    historial.unshift(ciudad);

    historial = historial.slice(0, 5);

    localStorage.setItem(
        'historial',
        JSON.stringify(historial)
    );

    mostrarHistorial();
}

function mostrarHistorial() {

    const contenedor = document.getElementById('historial');

    contenedor.innerHTML = '';

    historial.forEach(ciudad => {

        const boton = document.createElement('button');

        boton.textContent = ciudad;

        boton.addEventListener('click', () => {
            consultarClima(ciudad);
        });

        contenedor.appendChild(boton);
    });
}

mostrarHistorial();
const btnTema = document.getElementById('btnTema');

btnTema.addEventListener('click', () => {
    document.body.classList.toggle('claro');
});
const btnWhatsApp = document.getElementById('btnWhatsApp');

btnWhatsApp.addEventListener('click', () => {

    const ciudad = document.querySelector('.ciudad')?.textContent;
    const temperatura = document.querySelector('.temperatura')?.textContent;

    if (!ciudad || !temperatura) {
        alert('Primero consulta una ciudad.');
        return;
    }

    const mensaje = `El clima en ${ciudad} es de ${temperatura}`;

    const url = `https://wa.me/?text=${encodeURIComponent(mensaje)}`;

    window.open(url, '_blank');
});
async function obtenerPronostico(ciudad) {
    const contenedor = document.getElementById("pronostico");

    contenedor.innerHTML = "Cargando pronóstico...";

    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(ciudad)}&appid=${API_KEY}&units=metric&lang=es`;

    try {
        const respuesta = await fetch(url);
        const datos = await respuesta.json();

        if (!respuesta.ok) {
            throw new Error(datos.message || "No se pudo obtener el pronóstico");
        }

        // Elegir una previsión cercana al mediodía de cada día
        const dias = {};

        datos.list.forEach(item => {
            const fecha = item.dt_txt.split(" ")[0];

            if (!dias[fecha] || item.dt_txt.includes("12:00:00")) {
                dias[fecha] = item;
            }
        });

        contenedor.innerHTML = Object.values(dias)
            .slice(0, 5)
            .map(item => {
                const fecha = new Date(item.dt * 1000);

                const dia = fecha.toLocaleDateString("es-MX", {
                    weekday: "long",
                    day: "numeric",
                    month: "short",
                    timeZone: "UTC"
                });

                return `
                    <div class="dia-pronostico">
                        <h3>${dia}</h3>
                        <img
                            src="https://openweathermap.org/img/wn/${item.weather[0].icon}.png"
                            alt="${item.weather[0].description}"
                        >
                        <p>${item.weather[0].description}</p>
                        <strong>${Math.round(item.main.temp)} °C</strong>
                    </div>
                `;
            }).join("");

    } catch (error) {
        contenedor.textContent = "Error: " + error.message;
    }
}