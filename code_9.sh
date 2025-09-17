npm run build
> vite-shadcn@0.0.0 build
> tsc -b && vite build
src/pages/People.tsx:459:39 - error TS2322: Type '{ children: Element; open: boolean; onOnOpenChange: Dispatch<SetStateAction<boolean
>
>; }' is not assignable to type 'IntrinsicAttributes & DialogProps'.
Property 'onOnOpenChange' does not exist on type 'IntrinsicAttributes & DialogProps'. Did you mean 'onOpenChange'?
459 <Dialog open={isEditDialogOpen} onOnOpenChange={setIsEditDialogOpen}
>
~~~~~~~~~~~~~~
Found 1 error.
\
