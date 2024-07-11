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
    const copyButton = document.getElementById('copy-button');
    const copyMessage = document.getElementById('copy-message');

    // Set the range input attributes for min and max values
    rangeInput.min = 6;
    rangeInput.max = 100;

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
    if (!options.numbers && !options.symbols && !options.lowercase && !options.uppercase) {
       passwordOutput.textContent = "Please Select At Least One Box Below";
       passwordOutput.style.color = 'red'; // Set text color to red
    return;
     } else {
    passwordOutput.style.color = '#00FF00'; // Set text color to bright green
     }
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
        const historyItem = document.createElement('div');
        historyItem.classList.add('flex', 'justify-between', 'items-center', 'mb-2');
        historyItem.innerHTML = `
            <p>${password}</p>
            <button class="copy-history-button text-gray-400 hover:text-gray-200">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M15 2a1 1 0 00-1-1H6a1 1 0 00-1 1v1H4a2 2 0 00-2 2v11a2 2 0 002 2h9a2 2 0 002-2v-1h1a1 1 0 001-1V3a1 1 0 00-1-1h-1V2zm-1 1v11H4V4h1v1a1 1 0 001 1h6a1 1 0 001-1V4h1zm-2 0H8v1h4V3z" />
                </svg>
            </button>
            <span class="copy-message text-green-500 hidden">Copied</span>
        `;
        historyContainer.appendChild(historyItem);

        const copyHistoryButton = historyItem.querySelector('.copy-history-button');
        const copyMessage = historyItem.querySelector('.copy-message');

        copyHistoryButton.addEventListener('click', () => {
            copyToClipboard(password);
            showCopyMessage(copyMessage);
        });
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

    const copyToClipboard = (text) => {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
    };

    const showCopyMessage = (messageElement) => {
        messageElement.classList.remove('hidden');
        setTimeout(() => {
            messageElement.classList.add('hidden');
        }, 2000);
    };

    copyButton.addEventListener('click', () => {
        copyToClipboard(passwordOutput.textContent);
        showCopyMessage(copyMessage);
    });

    rangeInput.addEventListener('input', updateRangeValue);
    generateButton.addEventListener('click', generatePassword);

    updateRangeValue();
    
    // Add event listener for clicking on the password output to copy the password
    copyButton.addEventListener('click', () => {
    copyToClipboard(passwordOutput.textContent);
    showCopyMessage(copyMessage);
});
});