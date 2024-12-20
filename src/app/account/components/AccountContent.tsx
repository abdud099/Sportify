"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";

import { useUser } from "@/hooks/useUser";
import Button from "@/components/Button";
import useSubscribeModal from "@/hooks/useSubscribeModal";
import { postData } from "@/libs/helpers";
import Link from "next/link";

const AccountContent = () => {
  const router = useRouter();
  const subscribeModal = useSubscribeModal();
  const { isLoading, subscription, user } = useUser();

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace("/");
    }
  }, [isLoading, user, router]);

  const redirectToCustomerPortal = useCallback(async () => {
    setLoading(true);
    try {
      const { url, error } = await postData({
        url: "/api/create-portal-link",
      });

      if (error) {
        throw new Error(error);
      }

      window.location.assign(url);
    } catch (error) {
      alert((error as Error).message);
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <div className="mb-7 px-6">
      {!subscription && (
        <div className="flex flex-col gap-y-4">
          <p>No active plan.</p>
          <Button onClick={subscribeModal.onOpen} className="w-[300px]">
            Subscribe
          </Button>
        </div>
      )}
      {subscription && (
        <div className="flex flex-col gap-y-4">
          <p>
            You are currently on the
            <b> {subscription?.prices?.products?.name || "Unknown"} </b>
            plan.
          </p>
          <Button
            disabled={loading || isLoading}
            // onClick={redirectToCustomerPortal}
            className="w-[300px]"
          >
            <Link href={'/'}>
            {loading ? "Loading..." : "Open customer portal"}</Link>
          </Button>
        </div>
      )}
    </div>
  );
};

export default AccountContent;
