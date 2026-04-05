import braintree from "braintree";

const gateway = new braintree.BraintreeGateway({
  environment:
    process.env.BRAINTREE_ENV === "production"
      ? braintree.Environment.Production
      : braintree.Environment.Sandbox,
  merchantId: process.env.BRAINTREE_MERCHANT_ID!,
  publicKey: process.env.BRAINTREE_PUBLIC_KEY!,
  privateKey: process.env.BRAINTREE_PRIVATE_KEY!,
});

export default gateway;
