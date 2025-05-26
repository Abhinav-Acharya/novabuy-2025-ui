import { useEffect, useState } from "react";
import { ProductItem, Title } from ".";
import { useShopContext } from "../context/ShopContext";
import { Product } from "../types/types";

type Props = {
  category: Product["category"];
  subcategory: Product["subCategory"];
};

const RelatedProducts = ({ category, subcategory }: Props) => {
  const { products } = useShopContext();
  const [related, setRelated] = useState<Product[]>([]);

  useEffect(() => {
    if (products.length > 0) {
      let productsCopy = products.slice();

      productsCopy = productsCopy.filter((item) => category === item.category);
      productsCopy = productsCopy.filter(
        (item) => subcategory === item.subCategory
      );

      setRelated(productsCopy.slice(0, 5));
    }
  }, [category, products, subcategory]);

  return (
    <>
      <div>
        <div className="my-24">
          <div className="text-center text-3xl py-2">
            <Title text1={"RELATED"} text2={"PRODUCTS"} />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 2xl:grid-cols-5 gap-4 gap-y-6">
            {related.map((item, index) => (
              <ProductItem key={index} product={item} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default RelatedProducts;
