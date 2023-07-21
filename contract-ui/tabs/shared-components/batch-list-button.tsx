import { CreateListingsForm } from "../listings/components/list-form";
import { ListerOnly } from "@3rdweb-sdk/react/components/roles/lister-only";
import { Icon, useDisclosure } from "@chakra-ui/react";
import {
  UseContractResult,
  useAddress,
  useContractWrite,
  useCreateAuctionListing,
  useCreateDirectListing,
} from "@thirdweb-dev/react";
import { Marketplace, MarketplaceV3 } from "@thirdweb-dev/sdk/evm";
import { TransactionButton } from "components/buttons/TransactionButton";
import { useCreateAuctionBatch } from "contract-ui/hooks/useCreateAuctionBatch";
import { useCreateDirectBatch } from "contract-ui/hooks/useCreateDirectBatch";
import { useEffect } from "react";
import { FiPlus } from "react-icons/fi";
import { Button, Drawer } from "tw-components";
import { CreateBatchListingsForm } from "./batch-list-form";

const LIST_FORM_ID = "marketplace-batch-list-form";

interface CreateListingButtonProps {
  contractQuery:
    | UseContractResult<MarketplaceV3>
    | UseContractResult<Marketplace>;
  createText?: string;
  type?: "direct-listings" | "english-auctions";
}

export const CreateBatchListingButton: React.FC<CreateListingButtonProps> = ({
  contractQuery,
  createText = "Create",
  type,
  ...restButtonProps
}) => {
  const address = useAddress();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const directBatch = useCreateDirectBatch(contractQuery.contract);
  const auctionBatch = useCreateAuctionBatch(contractQuery.contract);
  return (
    <ListerOnly contract={contractQuery?.contract}>
      <Drawer
        allowPinchZoom
        preserveScrollBarGap
        size="lg"
        onClose={onClose}
        isOpen={isOpen}
        header={{ children: createText }}
        footer={{
          children: (
            <>
              <Button
                isDisabled={directBatch.isLoading || auctionBatch.isLoading}
                variant="outline"
                mr={3}
                onClick={onClose}
              >
                Cancel
              </Button>
              <TransactionButton
                isLoading={directBatch.isLoading || auctionBatch.isLoading}
                transactionCount={2}
                form={LIST_FORM_ID}
                type="submit"
                colorScheme="primary"
              >
                {createText}
              </TransactionButton>
            </>
          ),
        }}
      >
        <CreateBatchListingsForm
          contractQuery={contractQuery}
          directBatch={directBatch}
          auctionBatch={auctionBatch}
          formId={LIST_FORM_ID}
          type={type}
        />
      </Drawer>
      <Button
        colorScheme="primary"
        leftIcon={<Icon as={FiPlus} />}
        {...restButtonProps}
        onClick={onOpen}
        isDisabled={!address}
      >
        {createText}
      </Button>
    </ListerOnly>
  );
};
