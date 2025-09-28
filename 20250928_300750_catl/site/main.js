// Main JavaScript file for CATL Investment Analysis Website

// Global variables
let stockChart;
let currentPrice = 380.40; // Current stock price reference

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeAnimations();
    initializeCharts();
    initializeInteractiveElements();
    initializeScrollEffects();
});

// Animation initialization
function initializeAnimations() {
    // Animate navigation on scroll
    let lastScrollTop = 0;
    window.addEventListener('scroll', function() {
        let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const nav = document.querySelector('nav');
        
        if (scrollTop > lastScrollTop && scrollTop > 100) {
            nav.style.transform = 'translateY(-100%)';
        } else {
            nav.style.transform = 'translateY(0)';
        }
        lastScrollTop = scrollTop;
    });

    // Animate hero elements
    anime.timeline({
        easing: 'easeOutExpo',
        duration: 1000
    })
    .add({
        targets: '.hero-content h1',
        translateY: [100, 0],
        opacity: [0, 1],
        delay: 300
    })
    .add({
        targets: '.hero-content p',
        translateY: [50, 0],
        opacity: [0, 1],
        delay: 100
    }, '-=800')
    .add({
        targets: '.hero-content button',
        translateY: [30, 0],
        opacity: [0, 1],
        delay: 200
    }, '-=600');
}

// Chart initialization
function initializeCharts() {
    // Stock price chart (if element exists)
    const stockChartElement = document.getElementById('stockChart');
    if (stockChartElement) {
        initStockChart();
    }

    // Market share chart (if element exists)
    const marketShareElement = document.getElementById('marketShareChart');
    if (marketShareElement) {
        initMarketShareChart();
    }
}

// Initialize stock price chart
function initStockChart() {
    stockChart = echarts.init(document.getElementById('stockChart'));
    
    // Generate sample stock data
    const dates = [];
    const prices = [];
    const basePrice = 350;
    
    for (let i = 0; i < 90; i++) {
        const date = new Date();
        date.setDate(date.getDate() - (90 - i));
        dates.push(date.toISOString().split('T')[0]);
        
        // Generate realistic price movement
        const randomChange = (Math.random() - 0.5) * 20;
        const trendChange = Math.sin(i / 10) * 5;
        const price = basePrice + randomChange + trendChange + (i * 0.5);
        prices.push(price.toFixed(2));
    }

    const option = {
        title: {
            text: '宁德时代股价走势',
            left: 'center',
            textStyle: {
                color: '#1f2937',
                fontSize: 18,
                fontWeight: 'bold'
            }
        },
        tooltip: {
            trigger: 'axis',
            formatter: function(params) {
                return `日期: ${params[0].axisValue}<br/>价格: ¥${params[0].value}`;
            }
        },
        xAxis: {
            type: 'category',
            data: dates,
            axisLabel: {
                formatter: function(value) {
                    return value.split('-')[1] + '-' + value.split('-')[2];
                }
            }
        },
        yAxis: {
            type: 'value',
            name: '价格(元)',
            axisLabel: {
                formatter: '¥{value}'
            }
        },
        series: [{
            data: prices,
            type: 'line',
            smooth: true,
            itemStyle: {
                color: '#3b82f6'
            },
            areaStyle: {
                color: {
                    type: 'linear',
                    x: 0,
                    y: 0,
                    x2: 0,
                    y2: 1,
                    colorStops: [{
                        offset: 0, color: 'rgba(59, 130, 246, 0.3)'
                    }, {
                        offset: 1, color: 'rgba(59, 130, 246, 0.1)'
                    }]
                }
            }
        }],
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        }
    };

    stockChart.setOption(option);
}

// Initialize market share chart
function initMarketShareChart() {
    const chart = echarts.init(document.getElementById('marketShareChart'));
    
    const option = {
        tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b}: {c}% ({d}%)'
        },
        legend: {
            orient: 'vertical',
            left: 'left',
            data: ['宁德时代', '比亚迪', 'LG新能源', '中创新航', 'SK On', '松下', '其他']
        },
        series: [
            {
                name: '市场份额',
                type: 'pie',
                radius: ['40%', '70%'],
                center: ['60%', '50%'],
                avoidLabelOverlap: false,
                itemStyle: {
                    borderRadius: 10,
                    borderColor: '#fff',
                    borderWidth: 2
                },
                label: {
                    show: false,
                    position: 'center'
                },
                emphasis: {
                    label: {
                        show: true,
                        fontSize: '18',
                        fontWeight: 'bold'
                    }
                },
                labelLine: {
                    show: false
                },
                data: [
                    {value: 37.9, name: '宁德时代', itemStyle: {color: '#1e3a8a'}},
                    {value: 17.8, name: '比亚迪', itemStyle: {color: '#10b981'}},
                    {value: 9.4, name: 'LG新能源', itemStyle: {color: '#f59e0b'}},
                    {value: 4.3, name: '中创新航', itemStyle: {color: '#8b5cf6'}},
                    {value: 3.9, name: 'SK On', itemStyle: {color: '#ef4444'}},
                    {value: 3.7, name: '松下', itemStyle: {color: '#06b6d4'}},
                    {value: 23.0, name: '其他', itemStyle: {color: '#6b7280'}}
                ]
            }
        ]
    };
    
    chart.setOption(option);
}

// Interactive elements
function initializeInteractiveElements() {
    // Investment calculator
    const calculatorForm = document.getElementById('investmentCalculator');
    if (calculatorForm) {
        calculatorForm.addEventListener('submit', function(e) {
            e.preventDefault();
            calculateInvestmentReturn();
        });
    }

    // Price alerts
    const alertButtons = document.querySelectorAll('.price-alert-btn');
    alertButtons.forEach(button => {
        button.addEventListener('click', function() {
            const price = this.dataset.price;
            showNotification(`已设置价格提醒：¥${price}`, 'success');
        });
    });

    // Share buttons
    const shareButtons = document.querySelectorAll('.share-btn');
    shareButtons.forEach(button => {
        button.addEventListener('click', function() {
            shareContent();
        });
    });
}

// Investment calculator function
function calculateInvestmentReturn() {
    const amount = parseFloat(document.getElementById('investmentAmount').value);
    const targetPrice = parseFloat(document.getElementById('targetPrice').value);
    const currentPrice = 380.40;
    
    if (amount && targetPrice) {
        const shares = Math.floor((amount * 10000) / currentPrice);
        const futureValue = shares * targetPrice;
        const profit = futureValue - (amount * 10000);
        const returnRate = ((profit / (amount * 10000)) * 100);
        
        document.getElementById('calculatedShares').textContent = shares.toLocaleString();
        document.getElementById('calculatedProfit').textContent = (profit / 10000).toFixed(2);
        document.getElementById('calculatedReturn').textContent = returnRate.toFixed(2);
        
        // Show result with animation
        const resultDiv = document.getElementById('calculatorResult');
        resultDiv.style.display = 'block';
        anime({
            targets: resultDiv,
            opacity: [0, 1],
            translateY: [20, 0],
            duration: 500,
            easing: 'easeOutQuad'
        });
    }
}

// Scroll effects
function initializeScrollEffects() {
    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Animate cards
                if (entry.target.classList.contains('card-hover')) {
                    anime({
                        targets: entry.target,
                        translateY: [50, 0],
                        opacity: [0, 1],
                        duration: 800,
                        easing: 'easeOutQuad',
                        delay: Math.random() * 200
                    });
                }
                
                // Animate counters
                if (entry.target.classList.contains('counter')) {
                    animateCounter(entry.target);
                }
                
                // Animate progress bars
                if (entry.target.classList.contains('progress-bar')) {
                    animateProgressBar(entry.target);
                }
            }
        });
    }, observerOptions);

    // Observe elements
    document.querySelectorAll('.card-hover, .counter, .progress-bar').forEach(el => {
        observer.observe(el);
    });
}

// Counter animation
function animateCounter(element) {
    const target = parseInt(element.dataset.target);
    const duration = 2000;
    const start = 0;
    const increment = target / (duration / 16);
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        element.textContent = Math.floor(current).toLocaleString();
    }, 16);
}

// Progress bar animation
function animateProgressBar(element) {
    const targetWidth = element.dataset.width;
    anime({
        targets: element,
        width: targetWidth + '%',
        duration: 1500,
        easing: 'easeOutQuad'
    });
}

// Utility functions
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 ${
        type === 'success' ? 'bg-green-500' : 
        type === 'error' ? 'bg-red-500' : 'bg-blue-500'
    } text-white`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Animate in
    anime({
        targets: notification,
        translateX: [300, 0],
        opacity: [0, 1],
        duration: 300,
        easing: 'easeOutQuad'
    });
    
    // Remove after 3 seconds
    setTimeout(() => {
        anime({
            targets: notification,
            translateX: [0, 300],
            opacity: [1, 0],
            duration: 300,
            easing: 'easeInQuad',
            complete: () => {
                document.body.removeChild(notification);
            }
        });
    }, 3000);
}

function shareContent() {
    if (navigator.share) {
        navigator.share({
            title: '宁德时代投资分析',
            text: '深度分析宁德时代投资价值，把握新能源投资机遇',
            url: window.location.href
        }).then(() => {
            showNotification('分享成功！', 'success');
        }).catch(() => {
            showNotification('分享失败', 'error');
        });
    } else {
        // Fallback for browsers that don't support Web Share API
        const url = window.location.href;
        navigator.clipboard.writeText(url).then(() => {
            showNotification('链接已复制到剪贴板', 'success');
        });
    }
}

function scrollToSection(sectionId) {
    const element = document.getElementById(sectionId);
    if (element) {
        element.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Responsive chart resizing
window.addEventListener('resize', function() {
    if (stockChart) {
        stockChart.resize();
    }
    
    // Resize other charts
    const charts = document.querySelectorAll('[id$="Chart"]');
    charts.forEach(chartElement => {
        const chart = echarts.getInstanceByDom(chartElement);
        if (chart) {
            chart.resize();
        }
    });
});

// Export functions for global use
window.CATLAnalysis = {
    showNotification,
    shareContent,
    scrollToSection,
    calculateInvestmentReturn
};