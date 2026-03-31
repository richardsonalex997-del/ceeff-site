const CONTACT_ENDPOINT = '/api/telegram.php';

export async function submitContactRequest(payload) {
    const response = await fetch(CONTACT_ENDPOINT, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            ...payload,
            pageUrl: typeof window !== 'undefined' ? window.location.href : '',
            website: '',
        }),
    });

    let data = {};
    try {
        data = await response.json();
    } catch {
        data = {};
    }

    if (!response.ok || !data.ok) {
        throw new Error(data.message || 'Не удалось отправить заявку.');
    }

    return data;
}
