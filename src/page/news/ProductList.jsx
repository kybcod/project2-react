import React, { useEffect, useState } from "react";
import { Image, Table, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/react";
import axios from "axios";

export function ProductList() {
  const [productList, setProductList] = useState([]);
  useEffect(() => {
    axios.get(`/api/product/list`).then((res) => setProductList(res.data));
  }, []);

  return (
    <div>
      <Table>
        <Thead>
          <Tr>
            <Th>이미지</Th>
            <Th>제목</Th>
          </Tr>
        </Thead>
        <Tbody>
          {productList.map((product) => (
            <Tr key={product.title}>
              <Td onClick={() => (window.location.href = product.url)}>
                <Image
                  border={"1px solid black"}
                  w={"100px"}
                  h={"100px"}
                  src={product.image}
                />
              </Td>
              <Td>{product.title}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </div>
  );
}

export default ProductList;
