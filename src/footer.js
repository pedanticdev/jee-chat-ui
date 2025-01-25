const CopyrightFooter = () => {
    const currentYear = new Date().getFullYear();

    return (
        <p className="text-gray-600">
            © {currentYear} Luqman Saeed. All rights reserved.
        </p>
    );
};

export default CopyrightFooter;