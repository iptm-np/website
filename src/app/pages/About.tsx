import { Card, CardContent } from '../components/ui/card';
import { Target, Eye, Award, CheckCircle } from 'lucide-react';
import { Link } from 'react-router';
import { useContent } from '../contexts/ContentContext';
import aboutUs from "../../imports/iptm-nepal_logo.webp";
import { PageHeroBackground } from '../components/PageHeroBackground';

export function About() {
  const { teamMembers, pageHeroImages } = useContent();
  const leadershipMember = teamMembers.find(member => member.isLeadership);
  const otherMembers = teamMembers.filter(member => !member.isLeadership);


  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div>
      {/* Header Section */}


      <PageHeroBackground
       image={pageHeroImages?.['about'] || ""}
        fallbackClassName="bg-gradient-to-r from-brand-500 to-brand-700 text-white"
      >
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 w-full py-16">
            <div className="max-w-3xl">
              <h1 className="text-4xl font-bold mb-4 text-white">
                About Us
              </h1>

              <p className="text-lg md:text-2xl leading-relaxed mb-6">
                A multidisciplinary engineering and management organization
                dedicated to excellence.
              </p>
            </div>

            {/* Subsection Navigation */}
            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => scrollToSection('who-we-are')}
                className="px-6 py-2 bg-white/10 hover:bg-white/20 cursor-pointer rounded-full text-white border border-white/30 transition-colors duration-200"
              >
                Who We Are
              </button>
              <button
                onClick={() => scrollToSection('our-team')}
                className="px-6 py-2 bg-white/10 hover:bg-white/20 cursor-pointer rounded-full text-white border border-white/30 transition-colors duration-200"
              >
                Our Team
              </button>
            </div>
          </div>
        
      
      </PageHeroBackground>




      {/* Who We Are Section */}
      <section
        id="who-we-are"
        className="relative py-24 bg-gradient-to-b from-white to-brand-50 overflow-hidden"
      >
        {/* Background Blur */}
        <div className="absolute top-0 left-0 w-72 h-72 bg-brand-100 rounded-full blur-3xl opacity-40 -z-10" />
        <div className="absolute bottom-0 right-0 w-72 h-72 bg-brand-100 rounded-full blur-3xl opacity-40 -z-10" />

        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

            {/* LEFT CONTENT */}
            <div>
              {/* Heading */}
              <h2 className="text-4xl md:text-5xl font-extrabold leading-tight text-gray-800 mb-6">
                Building Nepal’s Future Through
                <span className="text-brand-600"> Engineering Excellence</span>
              </h2>

              {/* Description */}
              <p className="text-lg text-gray-600 leading-relaxed mb-6">
                IPTM Nepal was established in 2010 A.D. to provide professional training and capacity-building services to individuals and organizations across Nepal. We work with government and non-government organizations, private companies, development organizations, and professionals from a wide range of sectors. IPTM delivers corporate training, professional development programs, skill development initiatives, workshops, seminars, technical events, and customized training solutions designed to enhance professional competencies and strengthen organizational capabilities.

              </p>

              <p className="text-lg text-gray-600 leading-relaxed mb-8">
               Our training programs provide individuals and organizations with practical knowledge, tools, and techniques to improve workplace performance, productivity, leadership, management, and organizational effectiveness. Our areas of expertise include leadership and management training, project management, technical and specialized training, human resource development, organizational development, and capacity building. By combining experienced professionals, industry-relevant knowledge, and practical learning approaches, IPTM Nepal helps organizations develop their workforce and achieve sustainable professional growth.
              </p>

              {/* Feature Points */}
              <div className="grid grid-cols-2 gap-4 mb-8">
                {[
                  "Infrastructure Development",
                  "Project Management",
                  "Infrastructure Development",
                  "Professional Training",
                  "Sustainable Solutions",
                  "Technical Advisory",
                ].map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 bg-white shadow-sm border border-gray-100 rounded-xl px-4 py-3"
                  >
                    <CheckCircle className="h-4 w-4 text-brand-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700 font-medium text-sm">
                      {item}
                    </span>
                  </div>
                ))}
              </div>

              {/* CTA */}
              <div className="flex gap-4">
                <a
                  href="/portfolio"
                  className="bg-brand-600 hover:bg-brand-700 transition text-white px-6 py-3 rounded-xl font-semibold shadow-lg"
                >
                  Explore Our Portfolio
                </a>

                <a
                  href="/contact"
                  className="border border-gray-300 hover:border-brand-600 hover:text-brand-600 transition px-6 py-3 rounded-xl font-semibold text-gray-700"
                >
                  Contact Us
                </a>
              </div>
            </div>

            {/* RIGHT IMAGE */}
            <div className="relative">

              {/* Main Image */}
              <div className="relative rounded-[32px] overflow-hidden shadow-2xl border border-slate-200">

                <img
                  src={aboutUs}
                  alt="IPTM Nepal team"
                  className="w-full h-full object-cover"
                />

                {/* Dark Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>

                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent"></div>

                {/* Bottom Info Card */}
                <div className="absolute bottom-6 left-6 right-6 bg-white/90 backdrop-blur-md rounded-2xl p-5 shadow-xl">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    Trusted Engineering Partner in Nepal
                  </h3>

                  <p className="text-sm text-gray-600 leading-relaxed">
                    Delivering infrastructure solutions and professional training
                    with innovation, sustainability, and excellence.
                  </p>
                </div>
              </div>

              {/* Floating Badge */}
              <div className="absolute -bottom-6 -right-6 bg-brand-600 text-white px-6 py-4 rounded-2xl shadow-2xl">
                <CheckCircle className="h-8 w-8 text-white" />
                <p className="text-3xl font-extrabold">10+</p>
                <p className="text-sm font-medium">Technical Services</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <div className="bg-brand-100 p-3 rounded-full mb-4">
                    <Eye className="h-8 w-8 text-brand-600" />
                  </div>
                  <h3 className="font-semibold mb-3">Our Vision</h3>
                  <div className="text-sm text-gray-600 space-y-3 text-left">
                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-brand-600 mt-0.5 flex-shrink-0" />
                      <p>Leading organization in engineering and management</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-brand-600 mt-0.5 flex-shrink-0" />
                      <p>Recognized for delivering innovative and reliable solutions</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-brand-600 mt-0.5 flex-shrink-0" />
                      <p>Committed to sustainable development practices</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <div className="bg-brand-100 p-3 rounded-full mb-4">
                    <Target className="h-8 w-8 text-brand-600" />
                  </div>
                  <h3 className="font-semibold mb-3">Our Mission</h3>
                  <div className="text-sm text-gray-600 space-y-3 text-left">
                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-brand-600 mt-0.5 flex-shrink-0" />
                      <p>Enhance project quality through expert technical and management services</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-brand-600 mt-0.5 flex-shrink-0" />
                      <p>Strengthen institutional and human capacity across sectors</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-brand-600 mt-0.5 flex-shrink-0" />
                      <p>Deliver efficient, cost-effective, and sustainable solutions</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <div className="bg-brand-100 p-3 rounded-full mb-4">
                    <Award className="h-8 w-8 text-brand-600" />
                  </div>
                  <h3 className="font-semibold mb-3">Our Values</h3>
                  <div className="text-sm text-gray-600 space-y-3 text-left">
                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-brand-600 mt-0.5 flex-shrink-0" />
                      <p>Excellence in everything we do</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-brand-600 mt-0.5 flex-shrink-0" />
                      <p>Integrity and transparency</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-brand-600 mt-0.5 flex-shrink-0" />
                      <p>Innovation and collaboration</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Our Team Section */}
      <section id="our-team" className="py-16 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Our Team</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our team consists of qualified and experienced professionals including engineers,
              project managers, procurement experts, and administrative professionals who combine
              technical expertise with practical experience.
            </p>
          </div>

          {teamMembers.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <p>No team members added yet. Add team members from the admin dashboard.</p>
            </div>
          ) : (
            <>
              {/* Leadership Member - Center Highlight */}
              {leadershipMember && (
                <div className="max-w-2xl mx-auto mb-16">
                  <Link to={`/team/${leadershipMember.slug}`}>
                    <Card className="overflow-hidden hover:shadow-xl transition-shadow duration-200 cursor-pointer">
                      <div className="grid md:grid-cols-2 gap-6">
                        <img
                          src={leadershipMember.imageUrl}
                          alt={leadershipMember.name}
                          className="w-full h-full object-cover"
                        />
                        <CardContent className="pt-6 flex flex-col justify-center">
                          <div className="inline-block px-3 py-1 bg-brand-100 text-brand-600 text-xs rounded-full mb-3 w-fit">
                            Leadership
                          </div>
                          <h3 className="font-semibold text-2xl mb-2">{leadershipMember.name}</h3>
                          <p className="text-brand-600 mb-4">{leadershipMember.position}</p>
                          <p className="text-gray-600">{leadershipMember.bio}</p>
                        </CardContent>
                      </div>
                    </Card>
                  </Link>
                </div>
              )}

              {/* Other Team Members */}
              {otherMembers.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {otherMembers.map((member) => (
                    <Link key={member.id} to={`/team/${member.slug}`}>
                      <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-200 cursor-pointer h-full">
                        <img
                          src={member.imageUrl}
                          alt={member.name}
                          className="w-full h-64 object-cover"
                        />
                        <CardContent className="pt-6">
                          <h3 className="font-semibold text-lg mb-1">{member.name}</h3>
                          <p className="text-brand-600 text-sm mb-3">{member.position}</p>
                          <p className="text-sm text-gray-600">{member.bio}</p>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* Expertise Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Our Expertise</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our multidisciplinary team brings diverse skills and experience
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-2">Engineers</h3>
                <p className="text-sm text-gray-600">
                  Civil and infrastructure specialists with expertise in design, analysis, and project execution
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-2">Project Managers</h3>
                <p className="text-sm text-gray-600">
                  Experienced professionals in planning, coordination, and delivery of complex projects
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-2">Procurement Experts</h3>
                <p className="text-sm text-gray-600">
                  Contract and procurement specialists ensuring compliance and value for money
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-2">Support Staff</h3>
                <p className="text-sm text-gray-600">
                  Financial, administrative, and technical support professionals
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}