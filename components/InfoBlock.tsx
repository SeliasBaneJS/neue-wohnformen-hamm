export type Feature = { title: string, text: string };

export default function InfoBlock({ features }: { features: Feature[] }) {
  return (
    <section className="container py-5">
      <div className="row text-center mt-2 g-md-5 g-4">
        {features.map((feature, i) => (
          <div className="col-md-4" key={i}>
            <div className="card h-100 card-hover-elevate p-3 bg-white">
              <div className="card-body">
                <div className="mb-4 text-primary fs-1">
                  {i === 0 ? '🌿' : i === 1 ? '🤝' : '♿'}
                </div>
                <h3 className="card-title h4 fw-bold mb-3">{feature.title}</h3>
                <p className="card-text text-muted">{feature.text}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
