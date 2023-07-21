import { useContractType } from "@thirdweb-dev/react";
import {
  Marketplace,
  MarketplaceV3,
  NewAuctionListing,
} from "@thirdweb-dev/sdk";
import { ListForm } from "contract-ui/tabs/listings/components/list-form";
import { useState } from "react";

export function useCreateAuctionBatch(
  marketplaceContract: MarketplaceV3 | Marketplace | undefined,
) {
  const { data: contractType } = useContractType(
    marketplaceContract?.getAddress(),
  );
  const [data, setData] = useState<any>();
  const [auctionForms, setAuctionForms] = useState<any>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState();

  function addForm(newForm: any) {
    setAuctionForms((forms: any) => [...forms, newForm]);
  }

  function mutate() {
    setIsLoading(true);
    if (contractType === "marketplace-v3") {
      const marketplaceV3 = marketplaceContract as MarketplaceV3;
      marketplaceV3.englishAuctions
        .createAuctionsBatch(auctionForms)
        .then((result) => {
          setData(result);
        })
        .catch((error) => {
          setError(error);
        })
        .finally(() => setIsLoading(false));
    } else {
      const marketplace = marketplaceContract as Marketplace;
      marketplace.auction
        .createListingsBatch(auctionForms)
        .then((result) => {
          setData(result);
        })
        .catch((error) => {
          setError(error);
        })
        .finally(() => setIsLoading(false));
    }
  }

  return { data, mutate, addForm, auctionForms, isLoading, error };
}
