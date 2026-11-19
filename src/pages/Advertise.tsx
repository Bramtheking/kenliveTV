import { Helmet } from "react-helmet-async";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Phone, Mail, Megaphone, Tv, Radio, Newspaper, Users } from "lucide-react";
import SITE_CONFIG from "@/config/site";

const AdvertisePage = () => {
  const packages = [
    {
      icon: Tv,
      name: "TV Spot",
      desc: "30-second commercial aired during prime-time TV broadcasts",
      reach: "50,000+ daily viewers",
      color: "bg-primary text-primary-foreground",
    },
    {
      icon: Radio,
      name: "Radio Spot",
      desc: "Audio advertisement on KenLive Radio live stream",
      reach: "30,000+ listeners",
      color: "bg-blue-600 text-white",
    },
    {
      icon: Newspaper,
      name: "Digital Display",
      desc: "Banner or sponsored article on kenlive.co.ke news portal",
      reach: "100,000+ monthly readers",
      color: "bg-emerald-600 text-white",
    },
    {
      icon: Users,
      name: "Package Deal",
      desc: "Combined TV + Radio + Digital presence across all KenLive platforms",
      reach: "Full KenLive audience",
      color: "bg-purple-600 text-white",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Advertise With Us – KenLive TV</title>
        <meta name="description" content="Advertise on KenLive TV, Radio and Digital. Reach Kenya's growing audience." />
      </Helmet>

      <Navbar />

      {/* Hero */}
      <section className="bg-secondary border-b border-border py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-primary rounded-xl">
              <Megaphone className="w-7 h-7 text-primary-foreground" />
            </div>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-secondary-foreground mb-4">
            Advertise With <span className="text-primary">KenLive</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Reach Kenya's most engaged digital audience across TV, Radio, and Online. 
            We connect your brand with real Kenyans tuned in every day.
          </p>
        </div>
      </section>

      {/* Packages */}
      <section className="max-w-5xl mx-auto px-4 py-16">
        <h2 className="text-2xl font-bold text-center text-foreground mb-10">Advertising Packages</h2>
        <div className="grid sm:grid-cols-2 gap-6">
          {packages.map(pkg => (
            <div key={pkg.name} className="bg-card border border-border rounded-2xl p-6 shadow-md hover:shadow-lg transition-shadow">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${pkg.color}`}>
                <pkg.icon className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-foreground mb-2">{pkg.name}</h3>
              <p className="text-muted-foreground text-sm mb-3">{pkg.desc}</p>
              <div className="text-xs font-semibold text-primary bg-primary/10 px-3 py-1.5 rounded-full inline-block">
                {pkg.reach}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Contact CTA */}
      <section className="bg-primary py-14 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-extrabold text-primary-foreground mb-3">Ready to Advertise?</h2>
          <p className="text-primary-foreground/80 mb-8">Get in touch with our sales team for rates and availability.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href={`tel:${SITE_CONFIG.contact.phone}`}
              className="flex items-center gap-2 px-6 py-3 bg-white text-primary font-bold rounded-xl hover:bg-gray-100 transition-colors shadow-lg"
            >
              <Phone className="w-5 h-5" /> {SITE_CONFIG.contact.phone}
            </a>
            <a
              href={`mailto:${SITE_CONFIG.contact.email}`}
              className="flex items-center gap-2 px-6 py-3 bg-secondary text-secondary-foreground font-bold rounded-xl hover:bg-muted transition-colors shadow-lg"
            >
              <Mail className="w-5 h-5" /> {SITE_CONFIG.contact.email}
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default AdvertisePage;
