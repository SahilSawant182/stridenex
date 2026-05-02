export const parseBackendError = (err: any): string => {
    let errorMsg = "Failed to add value";
    
    // Extract the response data from the axios error
    const data = err?.response?.data || err?.data || err;
    
    if (data?._server_messages) {
        try {
            // Frappe sends _server_messages as a stringified JSON array of stringified JSON objects
            const messagesStrArray = typeof data._server_messages === 'string' 
                ? JSON.parse(data._server_messages) 
                : data._server_messages;
                
            if (Array.isArray(messagesStrArray) && messagesStrArray.length > 0) {
                const parsedMessage = typeof messagesStrArray[0] === 'string' 
                    ? JSON.parse(messagesStrArray[0]) 
                    : messagesStrArray[0];
                
                errorMsg = parsedMessage.message || errorMsg;
                // Remove HTML tags (e.g., <strong>Hello</strong> -> Hello)
                errorMsg = errorMsg.replace(/<[^>]*>?/gm, '');
            }
        } catch (e) {
            // Fallback if parsing fails
        }
    } else if (data?.message?.message) {
        errorMsg = data.message.message;
    } else if (typeof data?.message === 'string') {
        errorMsg = data.message;
    } else if (err?.message) {
        errorMsg = err.message;
    }
    
    // Clean up specific known database errors for better UX
    if (errorMsg.includes("Duplicate entry") || errorMsg.includes("already exists")) {
        // Find the specific value that's duplicate if possible
        const match = errorMsg.match(/Duplicate entry '(.*?)'/i) || errorMsg.match(/Skill (.*?) already exists/i);
        if (match && match[1]) {
            return `'${match[1]}' already exists`;
        }
        return "This value already exists";
    }
    
    return errorMsg;
};
