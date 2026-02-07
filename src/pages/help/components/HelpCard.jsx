import Icon from "../../../components/AppIcon";

const HelpCard = ({ icon, title, description }) => {
  return (
    <div className="rounded-xl border bg-card p-5 transition hover:shadow-md">
      <Icon name={icon} size={22} className="mb-3 text-primary" />
      <h3 className="mb-1 font-semibold">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
};

export default HelpCard;
