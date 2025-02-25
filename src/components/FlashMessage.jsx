const FlashMessage = ({ message, type }) => {
    if (!message) return null; 
    let messageClasses = "px-4 py-2 rounded-md text-sm font-semibold";

    if (type === "success") {
        messageClasses += " bg-green-100 text-green-800";
    } else if (type === "error") {
        messageClasses += " bg-red-100 text-red-800";
    } else if (type === "info") {
        messageClasses += " bg-blue-100 text-blue-800";
    }
    return (
        <div className={`w-full ${messageClasses}`}>
            <div className={`text-center  m-auto`}>
                {message}
            </div>
        </div>
    );
};

export default FlashMessage;
