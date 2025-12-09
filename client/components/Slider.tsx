"use client";

import { motion } from "framer-motion";
import Image from "next/image";

interface Product {
  _id: string;
  name: string;
  price: number;
  discountPrice?: number;
  discountPercentage?: number;
  image: string;
  description: string;
}

interface Props {
  products: Product[];
}

const ProductSlider = ({ products }: Props) => {
  return (
    <div className="overflow-x-auto py-6 px-4">
      <motion.div
        className="flex gap-6"
        initial={{ x: 100 }}
        animate={{ x: 0 }}
        transition={{ type: "spring", stiffness: 50, damping: 20 }}
      >
        {products.map((product) => (
          <motion.div
            key={product._id}
            whileHover={{ scale: 1.05 }}
            className="min-w-[250px] bg-white rounded-xl shadow-md p-4 flex-shrink-0"
          >
            <div className="relative w-full h-48">
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover rounded-lg"
              />
            </div>

            <h3 className="mt-3 font-semibold text-lg">{product.name}</h3>

            {/* Price with discount logic */}
            {product.discountPrice && product.discountPrice > 0 ? (
              <p className="mt-1 text-red-600 font-semibold">
                ${product.discountPrice.toLocaleString()}{" "}
                <span className="line-through text-gray-400 ml-2">
                  ${product.price.toLocaleString()}
                </span>{" "}
                {product.discountPercentage && (
                  <span className="text-green-600 ml-1">
                    ({product.discountPercentage}% off)
                  </span>
                )}
              </p>
            ) : (
              <p className="mt-1 text-gray-600 font-semibold">
                ${product.price.toLocaleString()}
              </p>
            )}

            <div
              className="mt-2 text-gray-800"
              dangerouslySetInnerHTML={{ __html: product.description }}
            />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default ProductSlider;
