import { MemoryRouter } from "react-router-dom";
import { test, expect } from "vitest";
import App from "~/components/App/App";
import { server } from "~/mocks/server";
import { rest } from "msw";
import API_PATHS from "~/constants/apiPaths";
import { CartItem } from "~/models/CartItem";
import { AvailableProduct } from "~/models/Product";
import { renderWithProviders } from "~/testUtils";
import { screen, waitForElementToBeRemoved } from "@testing-library/react";
import { formatAsPrice } from "~/utils/utils";

test("Renders products list", async () => {
  const products: AvailableProduct[] = [
    {
      id: "1",
      title: "Grand Theft Auto V",
      rating: 4.47,
      genres: "Action, Adventure",
      price: 479,
      count: 6,
      platforms:
        "PC, Xbox Series S/X, PlayStation 4, PlayStation 3, Xbox 360, Xbox One, PlayStation 5",
      released: "2013-09-17",
      image:
        "https://media.rawg.io/media/games/456/456dea5e1c7e3cd07060c14e96612001.jpg",
    },
    {
      id: "2",
      title: "The Witcher 3: Wild Hunt",
      rating: 4.67,
      genres: "Action, Adventure, RPG",
      price: 167,
      count: 0,
      platforms:
        "Nintendo Switch, PlayStation 5, Xbox Series S/X, Xbox One, PC, PlayStation 4",
      released: "2015-05-18",
      image:
        "https://media.rawg.io/media/games/618/618c2031a07bbff6b4f611f10b6bcdbc.jpg",
    },
  ];
  server.use(
    rest.get(`${API_PATHS.bff}/products/available`, (req, res, ctx) => {
      return res(
        ctx.status(200),
        ctx.delay(),
        ctx.json<AvailableProduct[]>(products)
      );
    }),
    rest.get(`${API_PATHS.cart}/profile/cart`, (req, res, ctx) => {
      return res(ctx.status(200), ctx.json<CartItem[]>([]));
    })
  );
  renderWithProviders(
    <MemoryRouter initialEntries={["/"]}>
      <App />
    </MemoryRouter>
  );

  await waitForElementToBeRemoved(() => screen.queryByText(/Loading/));
  products.forEach((product) => {
    expect(screen.getByText(product.title)).toBeInTheDocument();
    expect(screen.getByText(formatAsPrice(product.price))).toBeInTheDocument();
  });
});
