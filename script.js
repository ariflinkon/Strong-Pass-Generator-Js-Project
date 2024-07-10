/**
 * Project: Password Generator
 * Author: Arif Jahan Linkon
 * License: MIT
 * Version: 1.0.0
 * Description: This script generates a secure password based on user-selected criteria such as length, inclusion of numbers, symbols, lowercase and uppercase letters, and exclusion of similar or specific characters. It also maintains a history of generated passwords.
 */


document.addEventListener('DOMContentLoaded', () => {
    const passwordOutput = document.querySelector('.password-generator__output');
    const rangeInput = document.querySelector('.password-generator__range');
    const rangeValue = document.querySelector('.password-generator__range-value');
    const checkboxes = document.querySelectorAll('.password-generator__checkbox');
    const excludeInput = document.getElementById('exclude-characters');
    const generateButton = document.querySelector('.password-generator__button');
    const historyContainer = document.querySelector('.password-generator__history');
    const strengthBar = document.querySelector('.password-generator__strength-bar');
    const strengthText = document.querySelector('.password-generator__strength-text');

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
        updateStrengthBar(password);
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

    const updateStrengthBar = (password) => {
        let strength = 0;
        if (/[a-z]/.test(password)) strength++;
        if (/[A-Z]/.test(password)) strength++;
        if (/\d/.test(password)) strength++;
        if (/[!@#$%^&*()_+\[\]{}|;:,.<>?]/.test(password)) strength++;
        if (password.length >= 12) strength++;

        if (strength <= 2) {
            strengthBar.style.width = '33%';
            strengthBar.style.backgroundColor = 'red';
            strengthText.textContent = 'Strength: Low';
        } else if (strength === 3) {
            strengthBar.style.width = '66%';
            strengthBar.style.backgroundColor = 'yellow';
            strengthText.textContent = 'Strength: Medium';
        } else {
            strengthBar.style.width = '100%';
            strengthBar.style.backgroundColor = 'green';
            strengthText.textContent = 'Strength: Strong';
        }
    };

    rangeInput.addEventListener('input', updateRangeValue);
    generateButton.addEventListener('click', generatePassword);

    updateRangeValue();
});