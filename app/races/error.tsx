'use client'

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
    return (
        <div className="p-4 border-2 border-danger rounded-lg bg-danger-50 text-danger">
            <h2>Oups ! Quelque chose s'est mal passé.</h2>
            <p>{error.message}</p>
            <button onClick={() => reset()} className="mt-4 bg-danger text-white p-2 rounded">
                Réessayer
            </button>
        </div>
    );
}