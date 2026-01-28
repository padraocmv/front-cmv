import axios from "axios";

export function openWhatsAppChat() {
    const phoneNumber = '67996808200';
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    let whatsappURL = 'https://wa.me/' + phoneNumber;

    if (!isMobile) {
        whatsappURL = 'https://web.whatsapp.com/send?phone=' + phoneNumber;
    }

    window.open(whatsappURL, '_blank');
}

export function openAppStoreLink() {
    const appStoreURL = 'https://apps.apple.com/br/app/pax-primavera/id1559733415';
    const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);

    if (isIOS) {
        window.location.href = 'ios://open';
        setTimeout(() => {
            window.location.href = appStoreURL; 
        }, 1000);
    } else {
        window.open(appStoreURL, '_blank');
    }
}

export function openPlayStoreLink() {
    const playStoreURL = 'https://play.google.com/store/apps/details?id=com.paxprimavera.carteirinhas';
    const isAndroid = /Android/i.test(navigator.userAgent);

    if (isAndroid) {
        window.location.href = playStoreURL; 
        setTimeout(() => {
            window.location.href = playStoreURL;
        }, 1000); 
    } else {
        window.open(playStoreURL, '_blank');
    }
}
export function formatPhoneNumber(phoneNumber) {
    const cleanedPhoneNumber = phoneNumber.replace(/\D/g, '');

    if (cleanedPhoneNumber.length === 10) {
        return `(${cleanedPhoneNumber.slice(0, 2)}) ${cleanedPhoneNumber.slice(2, 6)}-${cleanedPhoneNumber.slice(6)}`;
    } else if (cleanedPhoneNumber.length === 11) {
        return `(${cleanedPhoneNumber.slice(0, 2)}) ${cleanedPhoneNumber.charAt(2)} ${cleanedPhoneNumber.slice(3, 7)}-${cleanedPhoneNumber.slice(7)}`;
    } else {
     
        return phoneNumber;
    }
}

export function formatCPF(cpf) {
    const cleanedCPF = cpf.replace(/\D/g, '');

    return cleanedCPF.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
}

export const formatCEP = (cep) => {
    return cep ? cep.replace(/\D/g, '').replace(/^(\d{5})(\d{3})$/, '$1-$2') : '';
};

export const buscarEnderecoPorCEP = async (cep) => {
    if (cep.length == 8) {
        try {
            const response = await axios.get(`https://viacep.com.br/ws/${cep.replace("-", "")}/json/`); // Adicionei as aspas
            const { data } = response;
            if (!data.erro) {
                return {
                    rua: data.logradouro,
                    bairro: data.bairro,
                    cidade: data.localidade,
                    estado: data.uf
                };
            } else {
                return null;
            }
        } catch (error) {
            throw new Error("Erro ao buscar CEP.");
        }
    }
    return null;
};

export function formatDate(dateString) {
    if (!dateString) {
        return '';
    }
    const [year, month, day] = dateString.split('-');

    return `${day}/${month}/${year}`;
}

export function primeiraLetraMaiuscula(input) {
    return input.toLowerCase().replace(/\b\w/g, char => char.toUpperCase());
}

export function validarCPF(cpf) {
    cpf = cpf.replace(/\D/g, '');

    if (cpf.length !== 11) {
        return false;
    }

    const digits = cpf.split('').map(Number);
    if (digits.every(digit => digit === digits[0])) {
        return false;
    }

    let sum = 0;
    for (let i = 0; i < 9; i++) {
        sum += parseInt(cpf.charAt(i)) * (10 - i);
    }
    let firstDigit = 11 - (sum % 11);
    if (firstDigit > 9) {
        firstDigit = 0;
    }

    if (parseInt(cpf.charAt(9)) !== firstDigit) {
        return false;
    }

    sum = 0;
    for (let i = 0; i < 10; i++) {
        sum += parseInt(cpf.charAt(i)) * (11 - i);
    }
    let secondDigit = 11 - (sum % 11);
    if (secondDigit > 9) {
        secondDigit = 0;
    }

    if (parseInt(cpf.charAt(10)) !== secondDigit) {
        return false;
    }

    return true;
}

export const formatValor = (valor) => {
    const parsedValor = parseFloat(valor); 
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
        minimumFractionDigits: 2, 
        maximumFractionDigits: 2, 
    }).format(parsedValor);
};

export const formatPrecoPorcao = (valor) => {
    return `R$ ${valor.toFixed(3).replace('.', ',')}`;
};

export const formatCmvReal = (valor) => {
    return new Intl.NumberFormat('pt-BR', {
        style: 'percent',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(valor / 100); 
};