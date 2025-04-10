document.addEventListener("DOMContentLoaded", () => {
    const allInputs = document.querySelectorAll(".app-input");

    function phoneMask(phone) {
        let cleaned = phone.replace(/\D/g, '');

        if (cleaned.startsWith('375')) {
            cleaned = cleaned.substring(3);
        }
        if (cleaned.length > 9) {
            cleaned = cleaned.substring(0, 9);
        }

        let formatted = '+375 (';

        if (cleaned.length > 0) {
            formatted += cleaned.substring(0, 2);
        }
        if (cleaned.length > 2) {
            formatted += ') ' + cleaned.substring(2, 5);
        }
        if (cleaned.length > 5) {
            formatted += '-' + cleaned.substring(5, 7);
        }
        if (cleaned.length > 7) {
            formatted += '-' + cleaned.substring(7, 9);
        }

        return formatted;
    }

    function addCommonHandlers(selector) {
        return component => {
            const inputElement = component.querySelector(selector);

            function setEmptyStyle(set) {
                component.classList.toggle("empty", set)
            }

            if (!inputElement) return;

            setEmptyStyle(inputElement.value.length === 0);

            inputElement.addEventListener('blur', function (e) {
                setEmptyStyle(e.target.value.length === 0);
            })

            inputElement.addEventListener('input', function (e) {
                setEmptyStyle(e.target.value.length === 0);
                const type = e.target.getAttribute("type");
                if (type === 'phone') {
                    const isDeletion = e.inputType?.includes('delete') ||
                        e.target.value.length < this.previousValue?.length;

                    this.previousValue = e.target.value;

                    if (!isDeletion) {
                        e.target.value = phoneMask(e.target.value);
                    }
                }
            })


            inputElement.addEventListener('keydown', function(e) {
                const type = e.target.getAttribute("type");
                if (type === 'phone') {

                    // backspace, delete, tab, escape, enter
                    if ([8, 46, 9, 27, 13].includes(e.keyCode)) {
                        return;
                    }

                    // Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
                    if ((e.ctrlKey || e.metaKey) && [65, 67, 86, 88].includes(e.keyCode)) {
                        return;
                    }

                    if (e.keyCode < 48 || e.keyCode > 57) {
                        if (e.keyCode < 96 || e.keyCode > 105) {
                            e.preventDefault();
                        }
                    }
                }
            });
        };
    }

    Array.from(allInputs).forEach(addCommonHandlers("input"));
    Array.from(allInputs).forEach(addCommonHandlers("textarea"));

})