import { useContractType } from "@thirdweb-dev/react";
import { Marketplace, MarketplaceV3 } from "@thirdweb-dev/sdk";
import { ListForm } from "contract-ui/tabs/listings/components/list-form";
import { useState } from "react";
export function useCreateDirectBatch(
  marketplaceContract: MarketplaceV3 | Marketplace | undefined,
) {
  const { data: contractType } = useContractType(
    marketplaceContract?.getAddress(),
  );
  const [data, setData] = useState<any>();
  const [directForms, setDirectForms] = useState<any>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState();

  function addForm(newForm: any) {
    setDirectForms((forms: any) => [...forms, newForm]);
  }

  function mutate() {
    setIsLoading(true);
    if (contractType === "marketplace-v3") {
      const marketplaceV3 = marketplaceContract as MarketplaceV3;
      marketplaceV3.directListings
        .createListingsBatch(directForms)
        .then((result) => {
          setData(result);
        })
        .catch((error) => {
          setError(error);
        })
        .finally(() => setIsLoading(false));
    } else {
      const marketplace = marketplaceContract as Marketplace;
      marketplace.direct
        .createListingsBatch(directForms)
        .then((result) => {
          setData(result);
        })
        .catch((error) => {
          setError(error);
        })
        .finally(() => setIsLoading(false));
    }
  }

  return { data, mutate, addForm, directForms, isLoading, error };
}
