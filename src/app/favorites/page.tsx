import { getServerSession } from 'next-auth';
import { Col, Container, Row } from 'react-bootstrap';
import { prisma } from '@/lib/prisma';
import { loggedInProtectedPage } from '@/lib/page-protection';
import authOptions from '@/lib/authOptions';
import { Restaurant } from '@prisma/client';
import RestaurantCard from '@/components/RestaurantCard';
// import { Restaurant } from '@prisma/client';

/** Render a list of stuff for the logged in user. */

type RestaurantWithLocationName = Restaurant & {
  locationName: string | null;
};

const FavoritesPage = async () => {
  // Protect the page, only logged in users can access it.
  const session = await getServerSession(authOptions);
  loggedInProtectedPage(
    session as {
      user: { email: string; id: string; randomKey: string };
      // eslint-disable-next-line @typescript-eslint/comma-dangle
    } | null,
  );
  const owner = (session && session.user && session.user.email) || '';
  const user = await prisma.user.findUnique({ where: { email: owner } });

  const getFavoritedRestaurants = async (): Promise<Restaurant[]> => {
    const favorites = await prisma.favoriteRestaurant.findMany({
      where: { userFavoritedId: user?.id },
    });
    const restaurantPromises: Promise<Restaurant | null>[] = [];

    favorites.forEach((favorite) => {
      restaurantPromises.push(
        prisma.restaurant.findUnique({
          where: { id: favorite.restaurantFavoritedId },
        }),
      );
    });

    const restaurants = (await Promise.all(restaurantPromises)).filter(
      Boolean,
    ) as Restaurant[];
    return restaurants;
  };

  const fetchedRestaurants: Restaurant[] = await getFavoritedRestaurants();

  const restaurants: RestaurantWithLocationName[] = await Promise.all(
    fetchedRestaurants.map(async (res) => {
      const location = await prisma.location.findUnique({
        where: { id: res.id },
      });

      return {
        ...res,
        locationName: location?.name || null,
      };
    }),
  );

  return (
    <main>
      <Container id="list" className="py-3">
        <h1 className="text-center">Your Favorite Restaurants</h1>
        <Row xs={1} md={3} className="g-4 mt-1">
          {restaurants.map((restaurant) => (
            <Col key={restaurant.name}>
              <RestaurantCard restaurant={restaurant} />
            </Col>
          ))}
        </Row>
      </Container>
    </main>
  );
};

export default FavoritesPage;
