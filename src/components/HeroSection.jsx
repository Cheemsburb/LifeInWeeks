import "./HeroSection.css";

function HeroSection({ weeksRemaining, age, yearsRemaining, userProfile }) {
  if (!userProfile) return null;

  const country = userProfile.country || "your country";

  return (
    <section className="hero-section">
      <div className="hero-intro">
        Based on your profile and life expectancy in {country}, you have:
      </div>
      <h2 className="hero-main">
        {weeksRemaining.toLocaleString()} Weeks Remaining
      </h2>
      <p className="hero-subtext">Make them count.</p>
    </section>
  );
}

export default HeroSection;
