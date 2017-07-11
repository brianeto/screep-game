module.exports.loop = function() {
    // Al iniciar creamos un creep
    Game.spawns.Spawn1.createCreep([WORK, CARRY, MOVE], undefined, {
        working: true
    });
    var choza = Game.spawns.Spawn1;
    // Por cada unidad de creep que tengamos ejecutemos lo siguiente:
    for (const unit in Game.creeps) {
        // defino variables a utilizar a lo largo del ciclo de vida de los creeps 
        var creep = Game.creeps[unit];
        var mine = creep.pos.findClosestByPath(FIND_SOURCES);
        // Creep se mueve a la mina más cercana 
        Game.creeps[unit].moveTo(mine);
        // Creep recolecta
        creep.harvest(mine);
        // Si el creep llega a su máxima capacidad, deje de trabajar, y vaya al spanw a entregar energia 
        if (creep.carry.energy === creep.carryCapacity) {
            creep.memory.working = false;
            creep.moveTo(choza);
            for (const resourceType in creep.carry) {
                creep.transfer(choza, resourceType);
            }
        }
        /* Cada vez que el Spawn está lleno crear 1 creep hasta llegar a 10 unidades, 
        para poder subir nivel al controlador hasta el nivel 2*/
        if (choza.energy == choza.energyCapacity && Game.creeps.length < 10) {
            choza.createCreep([WORK, CARRY, MOVE], undefined, {
                working: true
            });
            if (creep.room.controller.level < 2) {
                creep.moveTo(creep.room.controller)
                creep.upgradeController(creep.room.controller)
            } else {
                // una vez terminan los creeps siguen buscando recursos
                creep.harvest(mine);
            }
        }
    }
}
