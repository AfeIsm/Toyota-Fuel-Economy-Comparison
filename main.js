// Import Firebase functions at the top of the file
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/10.7.2/firebase-firestore.js";

// Make functions available globally
window.changeCar = changeCar;
window.toggleDropdown = toggleDropdown;

function toggleDropdown(side) {
    const dropdown = document.getElementById(`dropdownContent-${side}`);
    dropdown.classList.toggle("show");
}

async function changeCar(model, side) {
    const carImage = document.querySelector(`#car-${side}`);
    const graphContainer = document.getElementById(`mpg-graph-${side}`);
    
    if (!carImage) {
        console.error('Car image element not found');
        return;
    }
    
    const carImages = {
        'model1': 'camry.webp',
        'model2': 'camry xle.webp',
        'model3': 'carolla.avif',
        'model4': 'prius.avif',
        'model5': 'prius prime.avif',
        'model6': 'rav4 hybrid.png',
        'model7': 'rav4 prime.png',
        'model8': 'sienna.png',
        'model9': 'venza.avif',
        'model10': 'mirai.avif',
        'model11': 'mirai xle.webp'
    };
    
    // Map model IDs to full names for the graph
    const modelNames = {
        'model1': 'TOYOTA Camry LE-SE',
        'model2': 'TOYOTA Camry XLE-XSE',
        'model3': 'TOYOTA Corolla',
        'model4': 'TOYOTA Prius',
        'model5': 'TOYOTA Prius Prime',
        'model6': 'TOYOTA RAV4 Hybrid',
        'model7': 'TOYOTA RAV4 PRIME',
        'model8': 'TOYOTA Sienna',
        'model9': 'TOYOTA Venza',
        'model10': 'TOYOTA Mirai Limited',
        'model11': 'TOYOTA Mirai XLE'
    };
    
    if (carImages[model]) {
        // Handle car image change
        const tempImage = new Image();
        tempImage.onload = () => {
            carImage.src = carImages[model];
            carImage.className = `car-image ${model}`;
        };
        tempImage.onerror = () => {
            console.error(`Failed to load image: ${carImages[model]}`);
            carImage.src = 'default-car.png';
        };
        tempImage.src = carImages[model];
        
        // Create and display the graph
        createMPGGraph(modelNames[model], graphContainer, side);
    } else {
        console.error(`No image mapping found for model: ${model}`);
    }
}

async function createMPGGraph(modelName, container, side) {
    try {
        // Clear previous graph
        container.innerHTML = '';
        
        // Show loading state
        container.innerHTML = '<p>Loading graph...</p>';
        container.classList.add('show');
        
        // Use the global db instance
        const yearsRef2021 = collection(window.db, '2021');
        const yearsRef2022 = collection(window.db, '2022');
        const yearsRef2023 = collection(window.db, '2023');
        const yearsRef2024 = collection(window.db, '2024');
        const yearsRef2025 = collection(window.db, '2025');

        const querySnapshot2021 = await getDocs(yearsRef2021);
        const querySnapshot2022 = await getDocs(yearsRef2022);
        const querySnapshot2023 = await getDocs(yearsRef2023);
        const querySnapshot2024 = await getDocs(yearsRef2024);
        const querySnapshot2025 = await getDocs(yearsRef2025);
        console.log(querySnapshot2021.empty)

        
        
        if (querySnapshot2021.empty) {
            container.innerHTML = '<p>No data available for this model</p>';
            return;
        }

        const data = [];

        console.log(modelName);
        console.log();
        querySnapshot2021.forEach(doc => {
            if (doc.id === modelName) {
                console.log('match');

                const cityMPG = doc.data()['City MPG'];
                data.push({ year: 2021, mpg: cityMPG})
            }
        });
        querySnapshot2022.forEach(doc => {
            if (doc.id === modelName) {
                console.log('match');

                const cityMPG = doc.data()['City MPG'];
                data.push({ year: 2022, mpg: cityMPG})
            }
        });
        querySnapshot2023.forEach(doc => {
            if (doc.id === modelName) {
                console.log('match');

                const cityMPG = doc.data()['City MPG'];
                data.push({ year: 2023, mpg: cityMPG})
            }
        });
        querySnapshot2024.forEach(doc => {
            if (doc.id === modelName) {
                console.log('match');

                const cityMPG = doc.data()['City MPG'];
                data.push({ year: 2024, mpg: cityMPG})
            }
        });
        querySnapshot2025.forEach(doc => {
            if (doc.id === modelName) {
                console.log('match');

                const cityMPG = doc.data()['City MPG'];
                data.push({ year: 2025, mpg: cityMPG})
            }
        });
        
        console.log(data);
        
        // Sort data by year
        //data.sort((a, b) => a.year - b.year);
        
        if (data.length === 0) {
            container.innerHTML = '<p>No valid MPG data available for this model</p>';
            return;
        }

        // Create the graph using Chart.js
        const canvas = document.createElement('canvas');
        container.innerHTML = '';
        container.appendChild(canvas);
        
        // Define a professional color palette
        const colors = side === 'left' ? {
            primary: '#2196F3',    // Blue theme for left side
            secondary: '#4CAF50',
            accent: '#FFC107',
            gradient: ['#1976D2', '#2196F3', '#64B5F6']
        } : {
            primary: '#F44336',    // Red theme for right side
            secondary: '#E91E63',
            accent: '#FF9800',
            gradient: ['#D32F2F', '#F44336', '#EF5350']
        };

        // Create gradient for bars
        const ctx = canvas.getContext('2d');
        const gradient = ctx.createLinearGradient(0, 0, 0, 400);
        gradient.addColorStop(0, colors.gradient[0]);
        gradient.addColorStop(0.5, colors.gradient[1]);
        gradient.addColorStop(1, colors.gradient[2]);

        new Chart(canvas, {
            type: 'line',
            data: {
                labels: data.map(d => d.year),
                datasets: [{
                    label: 'City MPG Over Time',
                    data: data.map(d => d.mpg),
                    borderColor: colors.primary,
                    borderWidth: 3,
                    tension: 0.4,
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    fill: true,
                    pointBackgroundColor: colors.accent,
                    pointBorderColor: colors.primary,
                    pointBorderWidth: 2,
                    pointRadius: 5,
                    pointHoverRadius: 8,
                    pointHoverBackgroundColor: colors.accent,
                    pointHoverBorderColor: colors.accent,
                    pointHoverBorderWidth: 2
                }]
            },
            options: {
                responsive: true,
                animation: {
                    duration: 1500,
                    easing: 'easeInOutQuart'
                },
                plugins: {
                    title: {
                        display: true,
                        text: `${modelName} City Fuel Efficiency History`,
                        color: colors.text,
                        font: {
                            size: 16,
                            weight: 'bold',
                            family: "'Poppins', sans-serif"
                        },
                        padding: 20
                    },
                    legend: {
                        labels: {
                            color: colors.text,
                            font: {
                                family: "'Poppins', sans-serif"
                            }
                        }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        titleFont: {
                            family: "'Poppins', sans-serif"
                        },
                        bodyFont: {
                            family: "'Poppins', sans-serif"
                        },
                        padding: 12,
                        cornerRadius: 8
                    }
                },
                scales: {
                    y: {
                        min: Math.min(...data.map(d => d.mpg)) - 2,
                        max: Math.max(...data.map(d => d.mpg)) + 2,
                        grid: {
                            color: colors.grid,
                            drawBorder: false
                        },
                        ticks: {
                            color: colors.text,
                            font: {
                                family: "'Poppins', sans-serif"
                            },
                            padding: 8
                        }
                    },
                    x: {
                        grid: {
                            color: colors.grid,
                            drawBorder: false
                        },
                        ticks: {
                            color: colors.text,
                            font: {
                                family: "'Poppins', sans-serif"
                            },
                            padding: 8
                        }
                    }
                }
            }
        });
    } catch (error) {
        console.error('Error creating graph:', error);
        container.innerHTML = '<p>Error loading graph data</p>';
    }
}

// Add this at the top of your main.js file
document.addEventListener('DOMContentLoaded', function() {
    // Add smooth scrolling to all nav links
    document.querySelectorAll('.nav-item').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const navHeight = document.querySelector('.header-nav').offsetHeight;
                const targetPosition = targetSection.offsetTop - navHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
});

// Add this after the smooth scrolling code
function updateActiveNavItem() {
    const sections = document.querySelectorAll('section');
    const navItems = document.querySelectorAll('.nav-item');
    
    let currentSection = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100; // Adjust offset as needed
        const sectionHeight = section.clientHeight;
        const scrollPosition = window.scrollY;
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            currentSection = '#' + section.getAttribute('id');
        }
    });
    
    navItems.forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('href') === currentSection) {
            item.classList.add('active');
        }
    });
}

// Add scroll event listener
window.addEventListener('scroll', updateActiveNavItem);

  

