22 2nd March 04:46 KST

this multisig contract is from the Smart Contract Engineer challenges.
I was supposed to use motifiers, but what the hell. I just wanted to be explicit since it was a way of understanding how a basic multisig wallet works.
So the goal here is to make this multisig wallet be able to mint ERC20.

Three steps needed in the beginning for setting
1)Deploy ERC20 with owner.
2)Deploy Multisig Wallet. (I would prolly have to downgrade a bit to pragma 0.8.0)
3)Make Multisig as an owner of ERC20. (gotta check the openzeppelin Ownable lib to see how to change owner)

what I need to do for this experiment is that
1)Make a transaction struct which mints ERC20. (gotta see how data should be formed tho, just google low-level call or just check this webpage below)
2)Set minimum amount of apporval to...for example 3. And total number of owners as... like 6.
Where do the wallets come from? just run a ganache and make your life easier. 
3)Try to mint ERC20 by pressing execute() function in the multisig wallet smart contract. 

Maybe, later I can try to add some features so that the execution will cost some ERC20 tokens to be paid to another party(service provider's wallet address or smart contract)

maybe, just maybe I can make a server which controls the multisig wallet address with EIP712 signed transaction... then need verification functions on the Multisig wallet so may be a pain in the ass. Well still, it is just maybe. Maybe I just won't and move on to sth else.
