export default function CenterMessage({ children }: { children: React.ReactNode }) {
    return (
        <div
            className="d-flex justify-content-center align-items-center w-100 flex-column common-center"
        >
            {children}
        </div>
    );
}
