
export default function NoPageAvailable() {
    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '80vh',
                background: 'linear-gradient(135deg,rgb(216, 225, 235) 0%, #e0e7ef 100%)',
                borderRadius: '16px',
                boxShadow: '0 4px 14px rgba(0,0,0,0.08)',
                margin: '2rem auto',
                maxWidth: '480px',
                padding: '3rem 2rem'
            }}
        >
            <h1 style={{
                fontSize: '5rem',
                margin: 0,
                color: 'gray',
                fontWeight: 800,
                letterSpacing: '0.1em'
            }}>404</h1>
            <p style={{
                fontSize: '1.5rem',
                color:"gray",
                marginTop: '1rem',
                marginBottom: 0
            }}>
                No page available for this route.
            </p>
            <a
                href="/"
                style={{
                    marginTop: '2rem',
                    padding: '0.75rem 2rem',
                    background: '#2563eb',
                    color: '#ffff',
                    borderRadius: '8px',
                    textDecoration: 'none',
                    fontWeight: 600,
                    boxShadow: '0 2px 8px rgba(37,99,235,0.08)',
                    transition: 'background 0.2s'
                }}
            >
                Go Home
            </a>
        </div>
    );
}