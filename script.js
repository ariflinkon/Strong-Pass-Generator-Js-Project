document.addEventListener('DOMContentLoaded', () => {
    const passwordOutput = document.querySelector('.password-generator__output');
    const rangeInput = document.querySelector('.password-generator__range');
    const rangeValue = document.querySelector('.password-generator__range-value');
    const checkboxes = document.querySelectorAll('.password-generator__checkbox');
    const excludeInput = document.getElementById('exclude-characters');
    const generateButton = document.querySelector('.password-generator__button');
    const historyContainer = document.querySelector('.password-generator__history');

    const updateRangeValue = () => {
        rangeValue.textContent = rangeInput.value;
    };

    const generatePassword = () => {
        const length = parseInt(rangeInput.value);
        const options = {
            numbers: checkboxes[0].checked,
            symbols: checkboxes[1].checked,
            lowercase: checkboxes[2].checked,
            uppercase: checkboxes[3].checked,
            excludeSimilar: checkboxes[4].checked,
            strict: checkboxes[5].checked,
            excludeChars: excludeInput.value
        };

        const password = createPassword(length, options);
        passwordOutput.textContent = password;
        addToHistory(password);
    };

    const createPassword = (length, options) => {
        const numbers = '0123456789';
        const symbols = '!@#$%^&*()_+[]{}|;:,.<>?';
        const lowercase = 'abcdefghijklmnopqrstuvwxyz';
        const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const similarChars = 'il1Lo0O';

        let allChars = '';
        if (options.numbers) allChars += numbers;
        if (options.symbols) allChars += symbols;
        if (options.lowercase) allChars += lowercase;
        if (options.uppercase) allChars += uppercase;

        if (options.excludeSimilar) {
            allChars = allChars.split('').filter(char => !similarChars.includes(char)).join('');
        }

        if (options.excludeChars) {
            allChars = allChars.split('').filter(char => !options.excludeChars.includes(char)).join('');
        }

        let password = '';
        for (let i = 0; i < length; i++) {
            password += allChars.charAt(Math.floor(Math.random() * allChars.length));
        }

        if (options.strict) {
            if (options.numbers && !/\d/.test(password)) password += numbers.charAt(Math.floor(Math.random() * numbers.length));
            if (options.symbols && !/[!@#$%^&*()_+\[\]{}|;:,.<>?]/.test(password)) password += symbols.charAt(Math.floor(Math.random() * symbols.length));
            if (options.lowercase && !/[a-z]/.test(password)) password += lowercase.charAt(Math.floor(Math.random() * lowercase.length));
            if (options.uppercase && !/[A-Z]/.test(password)) password += uppercase.charAt(Math.floor(Math.random() * uppercase.length));
            password = password.slice(0, length);
        }

        return password;
    };

    const addToHistory = (password) => {
        const historyItem = document.createElement('p');
        historyItem.textContent = password;
        historyContainer.appendChild(historyItem);
    };

    rangeInput.addEventListener('input', updateRangeValue);
    generateButton.addEventListener('click', generatePassword);

    updateRangeValue();
});