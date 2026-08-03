import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { properties, getPropertyBySlug } from '@/data/properties';
import ImageGallery from '@/components/property-detail/ImageGallery';
import PropertyOverview from '@/components/property-detail/PropertyOverview';
import AmenitiesList from '@/components/property-detail/AmenitiesList';
import LocationMap from '@/components/property-detail/LocationMap';
import EMICalculator from '@/components/property-detail/EMICalculator';
import LeadForm from '@/components/property-detail/LeadForm';
import RelatedProperties from '@/components/property-detail/RelatedProperties';
import { buildMetadata } from '@/lib/seo';
import { propertySchema, breadcrumbSchema, JsonLd } from '@/lib/schema';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return properties.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const property = getPropertyBySlug(slug);
  if (!property) return {};

  return buildMetadata({
    title: `${property.title} | Group 24 Reality`,
    description: `${property.priceLabel} — ${property.description.slice(0, 155)}...`,
    openGraph: {
      title: property.title,
      description: `${property.type.charAt(0).toUpperCase() + property.type.slice(1)} for sale in ${property.location}, Rajasthan. ${property.priceLabel}. Contact Group 24 Reality.`,
      images: [
        {
          url: property.images[0],
          width: 1200,
          height: 630,
          alt: property.title,
        },
      ],
      url: `https://www.group24reality.com/properties/${property.slug}`,
    },
    alternates: {
      canonical: `https://www.group24reality.com/properties/${property.slug}`,
    },
  });
}

export default async function PropertyDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const property = getPropertyBySlug(slug);

  if (!property) notFound();

  return (
    <>
      <JsonLd data={propertySchema(property)} />
      <JsonLd
        data={breadcrumbSchema([
          { name: 'Home', url: '/' },
          { name: 'Properties', url: '/properties' },
          { name: property.title, url: `/properties/${property.slug}` },
        ])}
      />

      {/* Page spacing for sticky nav */}
      <div className="pt-20" />

      <div className="bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="mb-6">
            <ol className="flex items-center gap-2 text-sm font-inter text-slate-400">
              <li><a href="/" className="hover:text-gold-500 transition-colors">Home</a></li>
              <li aria-hidden="true">/</li>
              <li><a href="/properties" className="hover:text-gold-500 transition-colors">Properties</a></li>
              <li aria-hidden="true">/</li>
              <li className="text-navy-950 font-medium truncate max-w-xs">{property.title}</li>
            </ol>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-10">
              <ImageGallery images={property.images} alt={property.title} />
              <PropertyOverview property={property} />
              <AmenitiesList
                amenities={property.amenities}
                highlights={property.highlights}
                nearbyLandmarks={property.nearbyLandmarks}
              />
              <LocationMap location={property.location} address={property.address} />
            </div>

            {/* Sidebar */}
            <aside className="space-y-6" aria-label="Property enquiry and EMI">
              {/* Sticky wrapper */}
              <div className="lg:sticky lg:top-24 space-y-6">
                <LeadForm propertyTitle={property.title} propertySlug={property.slug} />
                <EMICalculator propertyPrice={property.price} />
              </div>
            </aside>
          </div>

          {/* Related Properties */}
          <RelatedProperties property={property} />
        </div>
      </div>
    </>
  );
}
