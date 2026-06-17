import { Item, ItemContent, ItemMedia, ItemTitle } from "@/components/ui/item";
import { Spinner } from "@/components/ui/spinner";

export function ActionLoader({ loadingAction }) {
  return (
    <div className="w-full ">
      <Item variant="muted" className="w-full border border-violet-200 bg-violet-50 m-2">
        <ItemMedia>
          <Spinner />
        </ItemMedia>
        <ItemContent>
          <ItemTitle className="line-clamp-1">{loadingAction}...</ItemTitle>
        </ItemContent>
      </Item>
    </div>
  );
}
