interface RacePageProps {
    params: Promise<{ id: string }>;
}

export default async function RaceDetailPage({ params }: RacePageProps) {
    const { id } = await params;

    // const race = await getRaceById(id);

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold">Détails de la course #{id}</h1>
            {/* Ton contenu ici */}
        </div>
    );
}