(function () {
    'use strict';

    const API_HOST = 'https://api.green-api.com';

    const $ = (id) => document.getElementById(id);
    const responseEl = $('response');

    const getCreds = () => {
        const idInstance = $('idInstance').value.trim();
        const apiTokenInstance = $('apiTokenInstance').value.trim();
        if (!idInstance || !apiTokenInstance) {
            throw new Error('Заполните idInstance и ApiTokenInstance');
        }
        return { idInstance, apiTokenInstance };
    };

    const normalizePhone = (raw) => {
        const digits = (raw || '').replace(/\D/g, '');
        if (!digits) throw new Error('Укажите номер телефона получателя');
        return `${digits}@c.us`;
    };

    const showResponse = (data) => {
        responseEl.value = typeof data === 'string'
            ? data
            : JSON.stringify(data, null, 2);
    };

    const showError = (err) => {
        responseEl.value = `Ошибка: ${err.message || err}`;
    };

    const callApi = async (method, httpMethod, body) => {
        const { idInstance, apiTokenInstance } = getCreds();
        const url = `${API_HOST}/waInstance${idInstance}/${method}/${apiTokenInstance}`;
        const init = { method: httpMethod, headers: {} };
        if (body !== undefined) {
            init.headers['Content-Type'] = 'application/json';
            init.body = JSON.stringify(body);
        }
        const res = await fetch(url, init);
        const text = await res.text();
        let parsed;
        try {
            parsed = JSON.parse(text);
        } catch (_) {
            parsed = text;
        }
        if (!res.ok) {
            const detail = typeof parsed === 'string' ? parsed : JSON.stringify(parsed, null, 2);
            throw new Error(`HTTP ${res.status} ${res.statusText}\n${detail}`);
        }
        return parsed;
    };

    const actions = {
        async getSettings() {
            return callApi('getSettings', 'GET');
        },
        async getStateInstance() {
            return callApi('getStateInstance', 'GET');
        },
        async sendMessage() {
            const chatId = normalizePhone($('msgPhone').value);
            const message = $('msgText').value;
            if (!message) throw new Error('Введите текст сообщения');
            return callApi('sendMessage', 'POST', { chatId, message });
        },
        async sendFileByUrl() {
            const chatId = normalizePhone($('filePhone').value);
            const urlFile = $('fileUrl').value.trim();
            if (!urlFile) throw new Error('Укажите URL файла');
            const fileName = urlFile.split('/').pop() || 'file';
            return callApi('sendFileByUrl', 'POST', { chatId, urlFile, fileName });
        },
    };

    document.addEventListener('click', async (e) => {
        const target = e.target;
        if (!(target instanceof HTMLButtonElement)) return;
        const action = target.dataset.action;
        if (!action || !actions[action]) return;

        target.disabled = true;
        responseEl.value = 'Загрузка...';
        try {
            const data = await actions[action]();
            showResponse(data);
        } catch (err) {
            showError(err);
        } finally {
            target.disabled = false;
        }
    });
})();
