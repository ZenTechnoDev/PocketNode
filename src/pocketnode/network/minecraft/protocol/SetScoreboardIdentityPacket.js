const DataPacket = pocketnode("network/minecraft/protocol/DataPacket");
const MinecraftInfo = pocketnode("network/minecraft/Info");
const ScoreboardEntry = pocketnode("network/minecraft/protocol/types/ScoreboardIdentityPacketEntry");

class SetScoreboardIdentityPacket extends DataPacket {



	static getId(){
		return MinecraftInfo.SET_SCOREBOARD_IDENTITY_PACKET;
	}

	initVars(){
		this.TYPE_REGISTER_IDENTITY = 0;
		this.TYPE_CLEAR_IDENTITY = 1;

		this.type = 0;
		this.entries = [];
	}

	constructor(){
		super();
		this.initVars();
	}

	_decodePayload(){
		this.type = this.readByte();
		let count = this.readUnsignedVarInt();
		for(let i = 0; i < count; i++){
			let entry = new ScoreboardEntry();
			entry.scoreboardId = this.readVarLong();
			if(this.type === this.TYPE_REGISTER_IDENTITY){
				entry.entityUniqueId = this.getEntityUniqueId();
			}
			this.entries.push(entry);
		}
	}

	_encodePayload(){
		this.writeByte(this.type);
		this.writeUnsignedVarInt(this.entries.length);
		for(let i = 0; i < this.entries.length; i++){
			let entry = this.entries[i];
			this.writeVarLong(entry.scoreboardId);
			if(this.type === this.TYPE_REGISTER_IDENTITY){
				this.writeEntityUniqueId(entry.entityUniqueId);
			}
		}
	}

	handle(session){
		return session.handleSetScoreboardIdentity(this);
	}
}

module.exports = SetScoreboardIdentityPacket;