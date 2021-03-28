package json;

import java.util.HashSet;

import model.SortedReactions;

/**
 * class for creating json
 * used for exchanging data (endpoints)
 * contains all forward and backward reactions as a set and maps for products and their forward or backward reactions
 * @author Daniel
 *
 */
public class KeggCreatorJobJSON {
//	public HashSet<KeggReaction> reactionSet;
	public HashSet<SortedReactions> productSortedReactions;
//	public HashSet<KeggReaction> reactionSetRev;
	public HashSet<SortedReactions> productSortedReactionsRev;
	
	public void cloneFrom(KeggCreatorJobJSON job) {
//		if (job.reactionSet != null) {
//			this.reactionSet = job.reactionSet;
//		} else {
//			this.reactionSet =new HashSet<KeggReaction>();
//		}
		if (job.productSortedReactions != null) {
			this.productSortedReactions = job.productSortedReactions;
		} else {
			this.productSortedReactions =new HashSet<SortedReactions>();
		}
//		if (job.reactionSetRev != null) {
//			this.reactionSetRev = job.reactionSetRev;
//		} else {
//			this.reactionSetRev =new HashSet<KeggReaction>();
//		}
		if (job.productSortedReactionsRev != null) {
			this.productSortedReactionsRev = job.productSortedReactionsRev;
		} else {
			this.productSortedReactionsRev =new HashSet<SortedReactions>();
		}

	}

}
