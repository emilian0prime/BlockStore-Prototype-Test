contract Blockstore =

  record purchase =
    { creatorAddress : address,
      url            : string,
      name           : string,
      amount      : int }

  record state =
    { purchases      : map(int, purchase),
      purchasesLength : int }

  entrypoint init() =
    { purchases = {},
      purchasesLength = 0 }

  entrypoint getPay(index : int) : purchase =
  	switch(Map.lookup(index, state.purchases))
	    None    => abort("There was no purchases with this index registered.")
	    Some(x) => x

  stateful entrypoint registerPurchase(url' : string, name' : string) =
    let purchase = { creatorAddress = Call.caller, url = url', name = name', amount = 0}
    let index = getPurchasesLength() + 1
    put(state{ purchases[index] = purchase, purchasesLength = index })

  entrypoint getPurchasesLength() : int =
    state.purchasesLength

  stateful entrypoint buyProduct(index : int) =
    let purchase = getPay(index)
    Chain.spend(purchase.creatorAddress, Call.value)
    let updatedamount = purchase.amount + Call.value
    let updatedPurchases = state.purchases{ [index].amount = updatedamount }
    put(state{ purchases = updatedPurchases })