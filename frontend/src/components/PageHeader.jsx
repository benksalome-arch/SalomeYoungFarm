function PageHeader({
  title,
  subtitle,
  buttonText,
  buttonLink,
}) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        marginBottom: "30px",
        flexWrap: "wrap",
        gap: "20px",
      }}
    >
      <div>
        <h1
          style={{
            margin: 0,
            color: "#1b5e20",
            fontSize: "34px",
            lineHeight: "1.2",
          }}
        >
          {title}
        </h1>

        {subtitle && (
          <p
            style={{
              color: "#666",
              margin: "8px 0 0 0",
              fontSize: "18px",
            }}
          >
            {subtitle}
          </p>
        )}
      </div>

      {buttonText && buttonLink && (
        <a
          href={buttonLink}
          className="button"
        >
          {buttonText}
        </a>
      )}
    </div>
  );
}

export default PageHeader;