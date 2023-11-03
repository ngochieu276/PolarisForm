import { useEffect, useState, useCallback } from "react";
import { json } from "@remix-run/node";
import { useActionData, useNavigation, useSubmit } from "@remix-run/react";
import {
  Page,
  Layout,
  Text,
  Card,
  Button,
  BlockStack,
  Box,
  List,
  Link,
  InlineStack,
  FormLayout,
  TextField,
  Label,
  Checkbox,
  Select,
  Icon,
} from "@shopify/polaris";
import { authenticate } from "../shopify.server";
import {CircleAlertMajor} from "@shopify/polaris-icons"

export const loader = async ({ request }) => {
  await authenticate.admin(request);

  return null;
};

export const action = async ({ request }) => {
  const { admin } = await authenticate.admin(request);
  const color = ["Red", "Orange", "Yellow", "Green"][
    Math.floor(Math.random() * 4)
  ];
  const response = await admin.graphql(
    `#graphql
      mutation populateProduct($input: ProductInput!) {
        productCreate(input: $input) {
          product {
            id
            title
            handle
            status
            variants(first: 10) {
              edges {
                node {
                  id
                  price
                  barcode
                  createdAt
                }
              }
            }
          }
        }
      }`,
    {
      variables: {
        input: {
          title: `${color} Snowboard`,
          variants: [{ price: Math.random() * 100 }],
        },
      },
    }
  );
  const responseJson = await response.json();

  return json({
    product: responseJson.data.productCreate.product,
  });
};

export default function Index() {
  const nav = useNavigation();
  const actionData = useActionData();
  const submit = useSubmit();
  const [selected, setSelected] = useState('today');
  const [isCheck, setIsCheck] = useState(true);
  const [apiType,setApiType] = useState('browser')
  const isLoading =
    ["loading", "submitting"].includes(nav.state) && nav.formMethod === "POST";
  const productId = actionData?.product?.id.replace(
    "gid://shopify/Product/",
    ""
  );

  const options = [
    {label: 'Entire Store', value: 'entireStore'},
    {label: 'Specific Store', value: 'specificStore'},
  ];

  const apiTypeLabelValue = [
    {label: 'Browser', value: 'browser'},
    {label: 'Conversions API', value: 'conversions'},
  ];

  const handleSelectChange = useCallback(
    (value) => setSelected(value),
    [],
  );

  useEffect(() => {
    if (productId) {
      shopify.toast.show("Product created");
    }
  }, [productId]);
  const generateProduct = () => submit({}, { replace: true, method: "POST" });

  const renderAPISelect = (selectValue) => {
    return apiTypeLabelValue.map((type, index) => {
      const isSelected = selectValue === type.value;
      return  (
        <div 
          key={type.value}
          onClick={() => setApiType(type.value)}
        >
          <Box 
            padding={200}
            background={`${isSelected ? 'bg-fill-success' : undefined}`}
          >
            <p
              style={{
                color: isSelected ? '#fff' : '#000',
                fontWeight: 'bold'
              }}
            >
            {type.label}
            </p>
          </Box>
        </div>
    )
    })
  }

  return (
    <Page>
      <ui-title-bar title="Remix app template">
        <button variant="primary" onClick={generateProduct}>
          Generate a product
        </button>
      </ui-title-bar>
      <BlockStack gap="500">
        <Layout>
          <Layout.Section>
            <Card>
              <BlockStack gap="500">
                <FormLayout>
                  <BlockStack>
                    <Label>Facebook Pixel Title<Text tone="critical" as="span">(*)</Text></Label>
                    <TextField onChange={() => {}} autoComplete="off" />
                    <Text variant="bodySm" as="p" tone="subdued">It help to do easily management facebook pixel</Text>
                  </BlockStack>
                  <BlockStack>
                    <InlineStack align="space-between">
                      <Label>Facebook Pixel ID<Text tone="critical" as="span">(*)</Text></Label>
                      <Link
                          url="https://google.com"
                          target="_blank"
                        >
                          Where can i get it?
                        </Link>
                    </InlineStack>
                    <TextField
                      onChange={() => {}}
                      autoComplete="off"
                    />
                  </BlockStack>
                  <BlockStack>
                    <InlineStack>
                      {renderAPISelect(apiType)}
                    </InlineStack>
                  </BlockStack>
                  <BlockStack>
                    <Text as="p" breakWord={true}>
                      Maximum combines all data sharing options to react the highest amount of customers. It uses Conversion API, which share
                      the data directly from our serves to Facebook. This mean the data can't be blocked by ad blocker. IOS 14+
                    </Text>
                  </BlockStack>
                  <BlockStack>
                    <div style={{backgroundColor: 'var(--p-color-bg-surface-success)'}}>
                      <Box padding="400">
                        <InlineStack>
                          <Icon
                            source={CircleAlertMajor}
                            tone="success"
                          />  
                          <BlockStack>
                            <Text as="strong">Upgrade Plan</Text>
                            <Text>This feature requires an upgrade. To continue this feature please upgrade plan here</Text>
                          </BlockStack>
                        </InlineStack>
                      </Box>
                    </div>
                  </BlockStack>
                  <BlockStack>
                    <Select
                      label="Target"
                      options={options}
                      onChange={handleSelectChange}
                      value={selected} 
                    />
                  </BlockStack>
                  <InlineStack blockAlign="center">
                    <Checkbox id="checkbox" name="checkbox" checked={isCheck} onChange={() => setIsCheck(!isCheck)} />
                    <Label>Enabled</Label>
                  </InlineStack>
                  <BlockStack inlineAlign="end" >
                    <Button variant="primary" tone="success">Save</Button>
                  </BlockStack>
                </FormLayout>
              </BlockStack>
            </Card>
          </Layout.Section>
          <Layout.Section variant="oneThird">
            <BlockStack gap="500">
              <Card>
                <BlockStack gap="200">
                  <Text as="h2" variant="headingMd">
                    App template specs
                  </Text>
                  <BlockStack gap="200">
                    <InlineStack align="space-between">
                      <Text as="span" variant="bodyMd">
                        Framework
                      </Text>
                      <Link
                        url="https://remix.run"
                        target="_blank"
                        removeUnderline
                      >
                        Remix
                      </Link>
                    </InlineStack>
                    <InlineStack align="space-between">
                      <Text as="span" variant="bodyMd">
                        Database
                      </Text>
                      <Link
                        url="https://www.prisma.io/"
                        target="_blank"
                        removeUnderline
                      >
                        Prisma
                      </Link>
                    </InlineStack>
                    <InlineStack align="space-between">
                      <Text as="span" variant="bodyMd">
                        Interface
                      </Text>
                      <span>
                        <Link
                          url="https://polaris.shopify.com"
                          target="_blank"
                          removeUnderline
                        >
                          Polaris
                        </Link>
                        {", "}
                        <Link
                          url="https://shopify.dev/docs/apps/tools/app-bridge"
                          target="_blank"
                          removeUnderline
                        >
                          App Bridge
                        </Link>
                      </span>
                    </InlineStack>
                    <InlineStack align="space-between">
                      <Text as="span" variant="bodyMd">
                        API
                      </Text>
                      <Link
                        url="https://shopify.dev/docs/api/admin-graphql"
                        target="_blank"
                        removeUnderline
                      >
                        GraphQL API
                      </Link>
                    </InlineStack>
                  </BlockStack>
                </BlockStack>
              </Card>
            </BlockStack>
          </Layout.Section>
        </Layout>
      </BlockStack>
    </Page>
  );
}
