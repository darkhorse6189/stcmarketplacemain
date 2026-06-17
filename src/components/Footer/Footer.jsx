import "./Footer.css";

const Footer = () => {
    // Get the current year dynamically
    const currentYear = 2025;

    return (
        <footer className="footer">
            <div className="footer-container">
                <div className="footer-content">
                <h3 className="footer-brand">DH MarketPlace</h3>
                <p className="footer-copyright">
                    © Copyright {currentYear} DH MarketPlace. All rights reserved.
                </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
