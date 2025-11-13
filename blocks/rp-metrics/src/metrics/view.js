function countUp(counter, start, end, duration, useCommas, useDecimals) {
    const startTime = performance.now();
    const change = end - start;
    const metricElement = counter.querySelector('.metric');
    // Determine decimal places based on the end value
    const decimalPlaces = useDecimals ? end.toString().split('.')[1].length : 0;

    function update(value) {
        let formattedValue = value.toFixed(decimalPlaces); // Apply decimal places throughout the animation

        if (useCommas) {
            formattedValue = formattedValue.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        }
        metricElement.textContent = formattedValue;
    }

    function startAnimation() {
        requestAnimationFrame(function animation(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / (duration * 1000), 1);
            const currentValue = start + change * progress;

            update(currentValue);

            if (progress < 1) {
                requestAnimationFrame(animation);
            } else {
                update(end);
            }
        });
    }

    startAnimation();

    return {
        counter,
        start,
        end,
        duration,
        startAnimation,
    };
}

function initCountUp() {
    const counters = document.querySelectorAll('.wp-block-rp-metric .counter');

    function onIntersection(entries, observer) {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const startValue = parseFloat(counter.getAttribute('data-count-start').replace(/,/g, ''));
                const endValueString = counter.getAttribute('data-count-end').replace(/,/g, '');
                const endValue = parseFloat(endValueString);
                const useCommas = counter.getAttribute('data-count-end').includes(',');
                const useDecimals = endValueString.includes('.');
                const duration = parseFloat(counter.getAttribute('data-count-duration'));
                const isAnimated = counter.getAttribute('data-count-animated') === 'true';

                if (isAnimated) {
                    countUp(counter, startValue, endValue, duration, useCommas, useDecimals);
                } else {
                    let finalValue = endValue.toFixed(useDecimals ? endValueString.split('.')[1].length : 0);
                    if (useCommas) {
                        finalValue = finalValue.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                    }
                    counter.querySelector('.metric').textContent = finalValue;
                }

                observer.unobserve(counter);
            }
        });
    }

    const observer = new IntersectionObserver(onIntersection, {
        rootMargin: '0px',
        threshold: 0,
    });

    counters.forEach((counter) => observer.observe(counter));
}

document.addEventListener('DOMContentLoaded', initCountUp);
