import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import {
  getPropertyBySlug,
  getAllPropertySlugs,
  getRelatedByLocation,
} from '@/lib/firestore/properties';
import ImageGallery from '@/components/property-detail/ImageGallery';
import PropertyDetailHeader from '@/components/property-detail/PropertyDetailHeader';
import PropertyOverview from '@/components/property-detail/PropertyOverview';
import AmenitiesList from '@/components/property-detail/AmenitiesList';
import LocationMap from '@/components/property-detail/LocationMap';
import EMICalculator from '@/components/property-detail/EMICalculator';
import LeadForm from '@/components/property-detail/LeadForm';
import { buildMetadata } from '@/lib/seo';
import { propertySchema, breadcrumbSchema, JsonLd } from '@/lib/schema';
import type { Property } from '@/types';
import PropertyCard from '@/components/properties/PropertyCard';
import { MobileBottomBar } from '@/components/ui/MobileBottomBar';
import { StaggerContainer, StaggerItem } from '@/components/ui/MotionWrapper';

// Re-generate slug list from Firestore so new properties get their pages
export async function generateStaticParams() {
  try {
    const slugs = await getAllPropertySlugs();
    return slugs.map((slug) => ({ slug }));
  } catch {
    return [];
  }
}

// Allow ISR — revalidate every 60 seconds so new Firestore properties appear
export const revalidate = 60;

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const property = await getPropertyBySlug(slug);
  if (!property) return {};

  return buildMetadata({
    title: property.title,
    description: `${property.priceLabel} — ${property.description.slice(0, 155)}...`,
    openGraph: {
      title: property.title,
      description: `${property.type.charAt(0).toUpperCase() + property.type.slice(1)} for sale in ${property.locationName}, Rajasthan. ${property.priceLabel}. Contact Group 24 Reality.`,
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
  const property = await getPropertyBySlug(slug);

  if (!property) notFound();

  // Fetch related properties from the same location
  const related = await getRelatedByLocation(property.locationSlug, property.id!, 3).catch(() => [] as Property[]);

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

      <PropertyDetailHeader property={property} />

      <div className="bg-gold py-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-10">
              <ImageGallery
                images={property.images}
                alt={property.title}
                tour360Url={property.tour360Url}
                propertyType={property.type}
              />
              <PropertyOverview property={property} />
              <AmenitiesList
                amenities={property.amenities}
                highlights={property.highlights}
                nearbyLandmarks={property.nearbyLandmarks}
              />
              <LocationMap location={property.locationName} address={property.address} />
            </div>

            {/* Sidebar */}
            <aside id="enquiry" className="space-y-6" aria-label="Property enquiry and EMI">
              {/* Sticky wrapper */}
              <div className="lg:sticky lg:top-24 space-y-6">
                <LeadForm propertyTitle={property.title} propertySlug={property.slug} />
                <EMICalculator propertyPrice={property.price} />
              </div>
            </aside>
          </div>

          {/* Related Properties */}
          {related.length > 0 && (
            <section className="mt-16 pt-10 border-t border-border-subtle" aria-labelledby="related-heading">
              <h2 id="related-heading" className="font-serif text-ink text-2xl mb-8">
                More in {property.locationName}
              </h2>
              <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {related.map((p) => (
                  <StaggerItem key={p.id}>
                    <PropertyCard property={p} />
                  </StaggerItem>
                ))}
              </StaggerContainer>
            </section>
          )}
        </div>
      </div>

      <MobileBottomBar
        whatsappMessage={`Hello Group24 Reality, I'm interested in ${property.title} (${property.priceLabel}). Please share more details.`}
        scheduleHref="#enquiry"
      />
    </>
  );
}
