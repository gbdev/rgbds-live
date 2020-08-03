"use strict";

var gbz80Instructions = [
    {
      "name" : "adc a, r8",
      "description" : "a = a + r8 + carry",
      "optionalA" : true,
      "cycles" : 1,
      "bytes" : 1,
      "flags" : {
        "z" : "Set if result is 0",
        "n" : "0",
        "h" : "Set if overflow from bit 3",
        "c" : "Set if overflow from bit 7"
      }
    },
    {
      "name" : "adc a, [hl]",
      "description" : "a = a + [hl] + carry",
      "optionalA" : true,
      "cycles" : 2,
      "bytes" : 1,
      "flags" : {
        "z" : "Set if result is 0",
        "n" : "0",
        "h" : "Set if overflow from bit 3",
        "c" : "Set if overflow from bit 7"
      }
    },
    {
      "name" : "adc a, n8",
      "description" : "a = a + n8 + carry",
      "optionalA" : true,
      "cycles" : 2,
      "bytes" : 2,
      "flags" : {
        "z" : "Set if result is 0",
        "n" : "0",
        "h" : "Set if overflow from bit 3",
        "c" : "Set if overflow from bit 7"
      }
    },
    {
      "name" : "add a, r8",
      "description" : "a = a + r8",
      "optionalA" : true,
      "cycles" : 1,
      "bytes" : 1,
      "flags" : {
        "z" : "Set if result is 0",
        "n" : "0",
        "h" : "Set if overflow from bit 3",
        "c" : "Set if overflow from bit 7"
      }
    },
    {
      "name" : "add a, [hl]",
      "description" : "a = a + [hl]",
      "optionalA" : true,
      "cycles" : 2,
      "bytes" : 1,
      "flags" : {
        "z" : "Set if result is 0",
        "n" : "0",
        "h" : "Set if overflow from bit 3",
        "c" : "Set if overflow from bit 7"
      }
    },
    {
      "name" : "add a, n8",
      "description" : "a = a + n8",
      "optionalA" : true,
      "cycles" : 2,
      "bytes" : 2,
      "flags" : {
        "z" : "Set if result is 0",
        "n" : "0",
        "h" : "Set if overflow from bit 3",
        "c" : "Set if overflow from bit 7"
      }
    },
    {
      "name" : "add hl, r16",
      "description" : "hl = hl + r16",
      "cycles" : 2,
      "bytes" : 1,
      "flags" : {
        "n" : "0",
        "h" : "Set if overflow from bit 11",
        "c" : "Set if overflow from bit 15"
      }
    },
    {
      "name" : "add hl, sp",
      "description" : "hl = hl + sp",
      "cycles" : 2,
      "bytes" : 1,
      "flags" : {
        "n" : "0",
        "h" : "Set if overflow from bit 11",
        "c" : "Set if overflow from bit 15"
      }
    },
    {
      "name" : "add sp, e8",
      "description" : "sp = sp + e8",
      "cycles" : 4,
      "bytes" : 2,
      "flags" : {
        "z" : "0",
        "n" : "0",
        "h" : "Set if overflow from bit 3",
        "c" : "Set if overflow from bit 7"
      }
    },
    {
      "name" : "and a, r8",
      "description" : "a = a & r8",
      "optionalA" : true,
      "cycles" : 1,
      "bytes" : 1,
      "flags" : {
        "z" : "Set if result is 0",
        "n" : "0",
        "h" : "1",
        "c" : "0"
      }
    },
    {
      "name" : "and a, [hl]",
      "description" : "a = a & [hl]",
      "optionalA" : true,
      "cycles" : 2,
      "bytes" : 1,
      "flags" : {
        "z" : "Set if result is 0",
        "n" : "0",
        "h" : "1",
        "c" : "0"
      }
    },
    {
      "name" : "and a, n8",
      "description" : "a = a & n8",
      "optionalA" : true,
      "cycles" : 2,
      "bytes" : 2,
      "flags" : {
        "z" : "Set if result is 0",
        "n" : "0",
        "h" : "1",
        "c" : "0"
      }
    },
    {
      "name" : "bit u3, r8",
      "description" : "Sets Z if bit u3 in r8 is 0",
      "cycles" : 2,
      "bytes" : 2,
      "flags" : {
        "z" : "Set if selected bit is 0",
        "n" : "0",
        "h" : "1"
      }
    },
    {
      "name" : "bit u3, [hl]",
      "description" : "Sets Z if bit u3 in [hl] is 0",
      "cycles" : 3,
      "bytes" : 2,
      "flags" : {
        "z" : "Set if selected bit is 0",
        "n" : "0",
        "h" : "1"
      }
    },
    {
      "name" : "call n16",
      "description" : "Calls address n16",
      "cycles" : 6,
      "bytes" : 3,
      "flags" : {}
    },
    {
      "name" : "call cc, n16",
      "description" : "Calls address n16 if condition cc is met",
      "cycles" : "6/3",
      "bytes" : 3,
      "flags" : {}
    },
    {
      "name" : "ccf",
      "description" : "Complements the carry flag",
      "cycles" : 1,
      "bytes" : 1,
      "flags" : {
        "n" : "0",
        "h" : "0",
        "c" : "Complemented"
      }
    },
    {
      "name" : "cp a, r8",
      "description" : "flags = a - r8",
      "optionalA" : true,
      "cycles" : 1,
      "bytes" : 1,
      "flags" : {
        "z" : "Set if result is 0 (a == r8)",
        "n" : "1",
        "h" : "Set if no borrow from bit 4",
        "c" : "Set if no borrow (a < r8)"
      }
    },
    {
      "name" : "cp a, [hl]",
      "description" : "flags = a - [hl]",
      "optionalA" : true,
      "cycles" : 2,
      "bytes" : 1,
      "flags" : {
        "z" : "Set if result is 0 (a == [hl])",
        "n" : "1",
        "h" : "Set if no borrow from bit 4",
        "c" : "Set if no borrow (a < [hl])"
      }
    },
    {
      "name" : "cp a, n8",
      "description" : "flags = a - n8",
      "optionalA" : true,
      "cycles" : 2,
      "bytes" : 2,
      "flags" : {
        "z" : "Set if result is 0 (a == n8)",
        "n" : "1",
        "h" : "Set if no borrow from bit 4",
        "c" : "Set if no borrow (a < n8)"
      }
    },
    {
      "name" : "cpl",
      "description" : "a = ~a",
      "cycles" : 1,
      "bytes" : 1,
      "flags" : {
        "n" : "1",
        "h" : "1"
      }
    },
    {
      "name" : "daa",
      "description" : "Decimal adjusts a to correct BCD value after arithmetic",
      "cycles" : 1,
      "bytes" : 1,
      "flags" : {
        "z" : "Set if result is 0",
        "h" : "0",
        "c" : "Set or reset based on operation"
      }
    },
    {
      "name" : "dec r8",
      "description" : "r8 -= 1",
      "cycles" : 1,
      "bytes" : 1,
      "flags" : {
        "z" : "Set if result is 0",
        "n" : "1",
        "h" : "Set if no borrow from bit 4"
      }
    },
    {
      "name" : "dec [hl]",
      "description" : "[hl] -= 1",
      "cycles" : 3,
      "bytes" : 1,
      "flags" : {
        "z" : "Set if result is 0",
        "n" : "1",
        "h" : "Set if no borrow from bit 4"
      }
    },
    {
      "name" : "dec r16",
      "description" : "r16 -= 1",
      "cycles" : 2,
      "bytes" : 1,
      "flags" : {}
    },
    {
      "name" : "dec sp",
      "description" : "sp -= 1",
      "cycles" : 2,
      "bytes" : 1,
      "flags" : {}
    },
    {
      "name" : "di",
      "description" : "Disables interrupts",
      "cycles" : 1,
      "bytes" : 1,
      "flags" : {}
    },
    {
      "name" : "ei",
      "description" : "Enables interrupts",
      "cycles" : 1,
      "bytes" : 1,
      "flags" : {}
    },
    {
      "name" : "halt",
      "description" : "Puts the CPU into low power mode",
      "cycles" : "-",
      "bytes" : 1,
      "flags" : {}
    },
    {
      "name" : "inc r8",
      "description" : "r8 += 1",
      "cycles" : 1,
      "bytes" : 1,
      "flags" : {
        "z" : "Set if result is 0",
        "n" : "0",
        "h" : "Set if overflow from bit 3"
      }
    },
    {
      "name" : "inc [hl]",
      "description" : "[hl] += 1",
      "cycles" : 3,
      "bytes" : 1,
      "flags" : {
        "z" : "Set if result is 0",
        "n" : "0",
        "h" : "Set if overflow from bit 3"
      }
    },
    {
      "name" : "inc r16",
      "description" : "r16 += 1",
      "cycles" : 2,
      "bytes" : 1,
      "flags" : {}
    },
    {
      "name" : "inc sp",
      "description" : "sp += 1",
      "cycles" : 2,
      "bytes" : 1,
      "flags" : {}
    },
    {
      "name" : "jp n16",
      "description" : "Jumps to address n16",
      "cycles" : 4,
      "bytes" : 3,
      "flags" : {}
    },
    {
      "name" : "jp cc, n16",
      "description" : "Jumps to address n16 if condition cc is met",
      "cycles" : "4/3",
      "bytes" : 3,
      "flags" : {}
    },
    {
      "name" : "jp hl",
      "description" : "Jumps to address in hl",
      "cycles" : 1,
      "bytes" : 1,
      "flags" : {}
    },
    {
      "name" : "jr e8",
      "description" : "Relative jumps by adding e8 to pc",
      "cycles" : 3,
      "bytes" : 2,
      "flags" : {}
    },
    {
      "name" : "jr cc, e8",
      "description" : "Relative jumps by adding e8 to pc if condition cc is met",
      "cycles" : "3/2",
      "bytes" : 2,
      "flags" : {}
    },
    {
      "name" : "ld r8, r8",
      "description" : "Copies the value from the right register into the left",
      "cycles" : 1,
      "bytes" : 1,
      "flags" : {}
    },
    {
      "name" : "ld r8, n8",
      "description" : "r8 = n8",
      "cycles" : 2,
      "bytes" : 2,
      "flags" : {}
    },
    {
      "name" : "ld r16, n16",
      "description" : "r16 = n16",
      "cycles" : 3,
      "bytes" : 3,
      "flags" : {}
    },
    {
      "name" : "ld [hl], r8",
      "description" : "[hl] = r8",
      "cycles" : 2,
      "bytes" : 1,
      "flags" : {}
    },
    {
      "name" : "ld [hl], n8",
      "description" : "[hl] = n8",
      "cycles" : 3,
      "bytes" : 2,
      "flags" : {}
    },
    {
      "name" : "ld r8, [hl]",
      "description" : "r8 = [hl]",
      "cycles" : 2,
      "bytes" : 1,
      "flags" : {}
    },
    {
      "name" : "ld [r16], a",
      "description" : "[r16] = a",
      "cycles" : 2,
      "bytes" : 1,
      "flags" : {}
    },
    {
      "name" : "ld [n16], a",
      "description" : "[n16] = a",
      "cycles" : 4,
      "bytes" : 3,
      "flags" : {}
    },
    {
      "name" : "ldh [$ff00+n8], a",
      "description" : "[$ff00+n8] = a",
      "cycles" : 3,
      "bytes" : 2,
      "flags" : {}
    },
    {
      "name" : "ld [$ff00+c], a",
      "description" : "[$ff00+c] = a",
      "cycles" : 2,
      "bytes" : 1,
      "flags" : {}
    },
    {
      "name" : "ld a, [r16]",
      "description" : "a = [r16]",
      "cycles" : 2,
      "bytes" : 1,
      "flags" : {}
    },
    {
      "name" : "ld a, [n16]",
      "description" : "a = [n16]",
      "cycles" : 4,
      "bytes" : 3,
      "flags" : {}
    },
    {
      "name" : "ldh a, [$ff00+n8]",
      "description" : "a = [$ff00+n8]",
      "cycles" : 3,
      "bytes" : 2,
      "flags" : {}
    },
    {
      "name" : "ld a, [$ff00+c]",
      "description" : "a = [$ff00+c]",
      "cycles" : 2,
      "bytes" : 1,
      "flags" : {}
    },
    {
      "name" : "ld [hl+], a",
      "description" : "[hl] = a, hl += 1",
      "aliasHLI" : true,
      "cycles" : 2,
      "bytes" : 1,
      "flags" : {}
    },
    {
      "name" : "ld [hl-], a",
      "description" : "[hl] = a, hl -= 1",
      "aliasHLD" : true,
      "cycles" : 2,
      "bytes" : 1,
      "flags" : {}
    },
    {
      "name" : "ld a, [hl+]",
      "description" : "a = [hl], hl += 1",
      "aliasHLI" : true,
      "cycles" : 2,
      "bytes" : 1,
      "flags" : {}
    },
    {
      "name" : "ld a, [hl-]",
      "description" : "a = [hl], hl -= 1",
      "aliasHLD" : true,
      "cycles" : 2,
      "bytes" : 1,
      "flags" : {}
    },
    {
      "name" : "ld sp, n16",
      "description" : "sp = n16",
      "cycles" : 3,
      "bytes" : 3,
      "flags" : {}
    },
    {
      "name" : "ld [n16], sp",
      "description" : "[n16, n16 + 1] = sp",
      "cycles" : 5,
      "bytes" : 3,
      "flags" : {}
    },
    {
      "name" : "ld hl, sp+e8",
      "description" : "hl = sp + e8",
      "cycles" : 3,
      "bytes" : 2,
      "flags" : {
        "z" : "0",
        "n" : "0",
        "h" : "Set if overflow from bit 3",
        "c" : "Set if overflow from bit 7"
      }
    },
    {
      "name" : "ld sp, hl",
      "description" : "sp = hl",
      "cycles" : 2,
      "bytes" : 1,
      "flags" : {}
    },
    {
      "name" : "nop",
      "description" : "No operation",
      "cycles" : 1,
      "bytes" : 1,
      "flags" : {}
    },
    {
      "name" : "or a, r8",
      "description" : "a = a | r8",
      "optionalA" : true,
      "cycles" : 1,
      "bytes" : 1,
      "flags" : {
        "z" : "Set if result is 0",
        "n" : "0",
        "h" : "0",
        "c" : "0"
      }
    },
    {
      "name" : "or a, [hl]",
      "description" : "a = a | [hl]",
      "optionalA" : true,
      "cycles" : 2,
      "bytes" : 1,
      "flags" : {
        "z" : "Set if result is 0",
        "n" : "0",
        "h" : "0",
        "c" : "0"
      }
    },
    {
      "name" : "or a, n8",
      "description" : "a = a | n8",
      "optionalA" : true,
      "cycles" : 2,
      "bytes" : 2,
      "flags" : {
        "z" : "Set if result is 0",
        "n" : "0",
        "h" : "0",
        "c" : "0"
      }
    },
    {
      "name" : "pop af",
      "description" : "Pops the stack into af",
      "cycles" : 3,
      "bytes" : 1,
      "flags" : {}
    },
    {
      "name" : "pop r16",
      "description" : "Pops the stack into r16",
      "cycles" : 3,
      "bytes" : 1,
      "flags" : {}
    },
    {
      "name" : "push af",
      "description" : "Pushes af onto the stack",
      "cycles" : 4,
      "bytes" : 1,
      "flags" : {}
    },
    {
      "name" : "push r16",
      "description" : "Pushes r16 onto the stack",
      "cycles" : 4,
      "bytes" : 1,
      "flags" : {}
    },
    {
      "name" : "res u3, r8",
      "description" : "Sets the bit u3 in r8 to 0",
      "cycles" : 2,
      "bytes" : 2,
      "flags" : {}
    },
    {
      "name" : "res u3, [hl]",
      "description" : "Sets the bit u3 in [hl] to 0",
      "cycles" : 4,
      "bytes" : 2,
      "flags" : {}
    },
    {
      "name" : "ret",
      "description" : "Returns from the current subroutine",
      "cycles" : 4,
      "bytes" : 1,
      "flags" : {}
    },
    {
      "name" : "ret cc",
      "description" : "Returns from the current subroutine if condition cc is met",
      "cycles" : "5/2",
      "bytes" : 1,
      "flags" : {}
    },
    {
      "name" : "reti",
      "description" : "Returns from the current subroutine and enables interrupts",
      "cycles" : 4,
      "bytes" : 1,
      "flags" : {}
    },
    {
      "name" : "rl r8",
      "description" : "Rotates r8 left, sets bit 0 to carry, sets carry to old bit 7",
      "cycles" : 2,
      "bytes" : 2,
      "flags" : {
        "z" : "Set if result is 0",
        "n" : "0",
        "h" : "0",
        "c" : "Set to old bit 7"
      }
    },
    {
      "name" : "rl [hl]",
      "description" : "Rotates [hl] left, sets bit 0 to carry, sets carry to old bit 7",
      "cycles" : 4,
      "bytes" : 2,
      "flags" : {
        "z" : "Set if result is 0",
        "n" : "0",
        "h" : "0",
        "c" : "Set to old bit 7"
      }
    },
    {
      "name" : "rla",
      "description" : "Rotates a left, sets bit 0 to carry, sets carry to old bit 7",
      "cycles" : 1,
      "bytes" : 1,
      "flags" : {
        "z" : "0",
        "n" : "0",
        "h" : "0",
        "c" : "Set to old bit 7"
      }
    },
    {
      "name" : "rlc r8",
      "description" : "Rotates r8 left, sets bit 0 and carry to old bit 7",
      "cycles" : 2,
      "bytes" : 2,
      "flags" : {
        "z" : "Set if result is 0",
        "n" : "0",
        "h" : "0",
        "c" : "Set to old bit 7"
      }
    },
    {
      "name" : "rlc [hl]",
      "description" : "Rotates [hl] left, sets bit 0 and carry to old bit 7",
      "cycles" : 4,
      "bytes" : 2,
      "flags" : {
        "z" : "Set if result is 0",
        "n" : "0",
        "h" : "0",
        "c" : "Set to old bit 7"
      }
    },
    {
      "name" : "rlca",
      "description" : "Rotates a left, sets bit 0 and carry to old bit 7",
      "cycles" : 1,
      "bytes" : 1,
      "flags" : {
        "z" : "0",
        "n" : "0",
        "h" : "0",
        "c" : "Set to old bit 7"
      }
    },
    {
      "name" : "rr r8",
      "description" : "Rotates r8 right, sets bit 7 to carry, sets carry to old bit 0",
      "cycles" : 2,
      "bytes" : 2,
      "flags" : {
        "z" : "Set if result is 0",
        "n" : "0",
        "h" : "0",
        "c" : "Set to old bit 0"
      }
    },
    {
      "name" : "rr [hl]",
      "description" : "Rotates [hl] right, sets bit 7 to carry, sets carry to old bit 0",
      "cycles" : 4,
      "bytes" : 2,
      "flags" : {
        "z" : "Set if result is 0",
        "n" : "0",
        "h" : "0",
        "c" : "Set to old bit 0"
      }
    },
    {
      "name" : "rra",
      "description" : "Rotates a right, sets bit 7 to carry, sets carry to old bit 0",
      "cycles" : 1,
      "bytes" : 1,
      "flags" : {
        "z" : "0",
        "n" : "0",
        "h" : "0",
        "c" : "Set to old bit 0"
      }
    },
    {
      "name" : "rrc r8",
      "description" : "Rotates r8 right, sets bit 7 and carry to old bit 0",
      "cycles" : 2,
      "bytes" : 2,
      "flags" : {
        "z" : "Set if result is 0",
        "n" : "0",
        "h" : "0",
        "c" : "Set to old bit 0"
      }
    },
    {
      "name" : "rrc [hl]",
      "description" : "Rotates [hl] right, sets bit 7 and carry to old bit 0",
      "cycles" : 4,
      "bytes" : 2,
      "flags" : {
        "z" : "Set if result is 0",
        "n" : "0",
        "h" : "0",
        "c" : "Set to old bit 0"
      }
    },
    {
      "name" : "rrca",
      "description" : "Rotates a right, sets bit 7 and carry to old bit 0",
      "cycles" : 1,
      "bytes" : 1,
      "flags" : {
        "z" : "0",
        "n" : "0",
        "h" : "0",
        "c" : "Set to old bit 0"
      }
    },
    {
      "name" : "rst vec",
      "description" : "Calls given reset vector",
      "cycles" : 4,
      "bytes" : 1,
      "flags" : {}
    },
    {
      "name" : "sbc a, r8",
      "description" : "a = a - r8 - c",
      "optionalA" : true,
      "cycles" : 1,
      "bytes" : 1,
      "flags" : {
        "z" : "Set if result is 0",
        "n" : "1",
        "h" : "Set if no borrow from bit 4",
        "c" : "Set if no borrow"
      }
    },
    {
      "name" : "sbc a, [hl]",
      "description" : "a = a - [hl] - c",
      "optionalA" : true,
      "cycles" : 2,
      "bytes" : 1,
      "flags" : {
        "z" : "Set if result is 0",
        "n" : "1",
        "h" : "Set if no borrow from bit 4",
        "c" : "Set if no borrow"
      }
    },
    {
      "name" : "sbc a, n8",
      "description" : "a = a - n8 - c",
      "optionalA" : true,
      "cycles" : 2,
      "bytes" : 2,
      "flags" : {
        "z" : "Set if result is 0",
        "n" : "1",
        "h" : "Set if no borrow from bit 4",
        "c" : "Set if no borrow"
      }
    },
    {
      "name" : "scf",
      "description" : "Sets the carry flag to 1",
      "cycles" : 1,
      "bytes" : 1,
      "flags" : {
        "n" : "0",
        "h" : "0",
        "c" : "1"
      }
    },
    {
      "name" : "set u3, r8",
      "description" : "Sets the bit u3 in r8 to 1",
      "cycles" : 2,
      "bytes" : 2,
      "flags" : {}
    },
    {
      "name" : "set u3, [hl]",
      "description" : "Sets the bit u3 in [hl] to 1",
      "cycles" : 4,
      "bytes" : 2,
      "flags" : {}
    },
    {
      "name" : "sla r8",
      "description" : "Shifts r8 left, sets carry to old bit 7",
      "cycles" : 2,
      "bytes" : 2,
      "flags" : {
        "z" : "Set if result is 0",
        "n" : "0",
        "h" : "0",
        "c" : "Set to old bit 7"
      }
    },
    {
      "name" : "sla [hl]",
      "description" : "Shifts [hl] left, sets carry to old bit 7",
      "cycles" : 4,
      "bytes" : 2,
      "flags" : {
        "z" : "Set if result is 0",
        "n" : "0",
        "h" : "0",
        "c" : "Set to old bit 7"
      }
    },
    {
      "name" : "sra r8",
      "description" : "Shifts r8 right keeping bit 7 unchanged, sets carry to old bit 0",
      "cycles" : 2,
      "bytes" : 2,
      "flags" : {
        "z" : "Set if result is 0",
        "n" : "0",
        "h" : "0",
        "c" : "Set to old bit 0"
      }
    },
    {
      "name" : "sra [hl]",
      "description" : "Shifts [hl] right keeping bit 7 unchanged, sets carry to old bit 0",
      "cycles" : 4,
      "bytes" : 2,
      "flags" : {
        "z" : "Set if result is 0",
        "n" : "0",
        "h" : "0",
        "c" : "Set to old bit 0"
      }
    },
    {
      "name" : "srl r8",
      "description" : "Shifts r8 right, sets carry to old bit 0",
      "cycles" : 2,
      "bytes" : 2,
      "flags" : {
        "z" : "Set if result is 0",
        "n" : "0",
        "h" : "0",
        "c" : "Set to old bit 0"
      }
    },
    {
      "name" : "srl [hl]",
      "description" : "Shifts [hl] right, sets carry to old bit 0",
      "cycles" : 4,
      "bytes" : 2,
      "flags" : {
        "z" : "Set if result is 0",
        "n" : "0",
        "h" : "0",
        "c" : "Set to old bit 0"
      }
    },
    {
      "name" : "stop",
      "description" : "Puts the CPU into very low power mode",
      "cycles" : "-",
      "bytes" : "2",
      "flags" : {}
    },
    {
      "name" : "sub a, r8",
      "description" : "a = a - r8",
      "optionalA" : true,
      "cycles" : 1,
      "bytes" : 1,
      "flags" : {
        "z" : "Set if result is 0 (a == r8)",
        "n" : "1",
        "h" : "Set if no borrow from bit 4",
        "c" : "Set if no borrow (a < r8)"
      }
    },
    {
      "name" : "sub a, [hl]",
      "description" : "a = a - [hl]",
      "optionalA" : true,
      "cycles" : 2,
      "bytes" : 1,
      "flags" : {
        "z" : "Set if result is 0 (a == [hl])",
        "n" : "1",
        "h" : "Set if no borrow from bit 4",
        "c" : "Set if no borrow (a < [hl])"
      }
    },
    {
      "name" : "sub a, n8",
      "description" : "a = a - n8",
      "optionalA" : true,
      "cycles" : 2,
      "bytes" : 2,
      "flags" : {
        "z" : "Set if result is 0 (a == n8)",
        "n" : "1",
        "h" : "Set if no borrow from bit 4",
        "c" : "Set if no borrow (a < n8)"
      }
    },
    {
      "name" : "swap r8",
      "description" : "Swaps the upper and lower 4 bits in r8",
      "cycles" : 2,
      "bytes" : 2,
      "flags" : {
        "z" : "Set if result is 0",
        "n" : "0",
        "h" : "0",
        "c" : "0"
      }
    },
    {
      "name" : "swap [hl]",
      "description" : "Swaps the upper and lower 4 bits in [hl]",
      "cycles" : 4,
      "bytes" : 2,
      "flags" : {
        "z" : "Set if result is 0",
        "n" : "0",
        "h" : "0",
        "c" : "0"
      }
    },
    {
      "name" : "xor a, r8",
      "description" : "a = a ^ r8",
      "optionalA" : true,
      "cycles" : 1,
      "bytes" : 1,
      "flags" : {
        "z" : "Set if result is 0",
        "n" : "0",
        "h" : "0",
        "c" : "0"
      }
    },
    {
      "name" : "xor a, [hl]",
      "description" : "a = a ^ [hl]",
      "optionalA" : true,
      "cycles" : 2,
      "bytes" : 1,
      "flags" : {
        "z" : "Set if result is 0",
        "n" : "0",
        "h" : "0",
        "c" : "0"
      }
    },
    {
      "name" : "xor a, n8",
      "description" : "a = a ^ n8",
      "optionalA" : true,
      "cycles" : 2,
      "bytes" : 2,
      "flags" : {
        "z" : "Set if result is 0",
        "n" : "0",
        "h" : "0",
        "c" : "0"
      }
    }
  ]

var gbz80HardwareInc = [
    {name: "_HW",          description: "Start of the hardware IO registers.<br>$FF00->$FF80"},

    {name: "_VRAM",        description: "VRAM Memory:<br>$8000->$9FFF"},
    {name: "_SCRN0",       description: "Background 0 Memory:<br>$9800->$9BFF"},
    {name: "_SCRN1",       description: "Background 1 Memory:<br>$9C00->$9FFF"},
    {name: "_SRAM",        description: "Card SRAM:<br>$A000->$BFFF"},
    {name: "_RAM",         description: "WRAM Memory:<br>$C000->$DFFF"},
    {name: "_OAMRAM",      description: "OAM Memory:<br>$FE00->$FE9F"},
    {name: "_AUD3WAVERAM", description: "WAVE Channel Memory:<br>$FF30->$FF3F"},
    {name: "_HRAM",        description: "HRAM Memory:<br>$FF80->$FFFE"},

    // MBC5 related, ignored.
    //{name: "rRAMG",        description: "$0000 ; $0000->$1fff
    //{name: "rROMB0",       description: "$2000 ; $2000->$2fff
    //{name: "rROMB1",       description: "$3000 ; $3000->$3fff - If more than 256 ROM banks are present.
    //{name: "rRAMB",        description: "$4000 ; $4000->$5fff - Bit 3 enables rumble (if present)

    // OAM flags
    {name: "OAMF_PRI",        description: "Flag to set on OAM attribute byte to make the background colors 1-3 to have priority over the sprite.<br>Value: %10000000"},
    {name: "OAMF_YFLIP",      description: "Flag to set on OAM attribute byte to make the sprite flip in the Y direction<br>Value: %01000000"},
    {name: "OAMF_XFLIP",      description: "Flag to set on OAM attribute byte to make the sprite flip in the X direction<br>Value: %00100000"},
    {name: "OAMF_PAL0",       description: "Flag to set on OAM attribute byte to make the sprite use OBP0 in DMG (non-color) mode.<br>Value: %00000000"},
    {name: "OAMF_PAL1",       description: "Flag to set on OAM attribute byte to make the sprite use OBP1 in DMG (non-color) mode.<br>Value: %00000000"},
    {name: "OAMF_BANK0",      description: "Flag to set on OAM attribute byte to use a sprite graphics from VRAM Bank 0 in GBC mode.<br>Value: %00000000"},
    {name: "OAMF_BANK1",      description: "Flag to set on OAM attribute byte to use a sprite graphics from VRAM Bank 1 in GBC mode.<br>Value: %00001000"},

    {name: "OAMF_PALMASK",    description: "Mask of the color sprite palette index in the OAM attribute byte. In GBC mode.<br>Value: %00000111"},

    {name: "OAMB_PRI",        description: "Bit number to set on OAM attribute byte to make the background colors 1-3 to have priority over the sprite.<br>Value: 7"},
    {name: "OAMB_YFLIP",      description: "Bit number to set on OAM attribute byte to make the sprite flip in the Y direction<br>Value: 6"},
    {name: "OAMB_XFLIP",      description: "Bit number to set on OAM attribute byte to make the sprite flip in the X direction<br>Value: 5"},
    {name: "OAMB_PAL1",       description: "Bit number to set on OAM attribute byte to make the sprite use OBP1 in DMG (non-color) mode.<br>Value: 4"},
    {name: "OAMB_BANK1",      description: "Bit number to set on OAM attribute byte to use a sprite graphics from VRAM Bank 1 in GBC mode.<br>Value: 3"},

    // IO Registers
    {name: "rP1", description: "Register for reading joy pad info. (R/W)<br>Value: $FF00"},

    {name: "P1F_5", description: "%00100000 ; P15 out port, set to 0 to get buttons"},
    {name: "P1F_4", description: "%00010000 ; P14 out port, set to 0 to get dpad"},
    {name: "P1F_3", description: "%00001000 ; P13 in port"},
    {name: "P1F_2", description: "%00000100 ; P12 in port"},
    {name: "P1F_1", description: "%00000010 ; P11 in port"},
    {name: "P1F_0", description: "%00000001 ; P10 in port"},

    {name: "P1F_GET_DPAD", description: "Value to load in rP1 to enable the reading of the DPad inputs."},
    {name: "P1F_GET_BTN",  description: "Value to load in rP1 to enable the reading of the A/B/Start/Select inputs."},
    {name: "P1F_GET_NONE", description: "Value to load in rP1 to disable the reading of input buttons."},

    //SB ($FF01)
    {name: "rSB", description: "Serial Transfer Data (R/W)<br>Value: $FF01"},

    //SC ($FF02)
    {name: "rSC", description: "Serial I/O Control (R/W)<br>Value: $FF02"},

    //DIV ($FF04)
    {name: "rDIV", description: "Divider register (R/W)<br>Incremented at 16384Hz or 32768Hz depending on the CPU speed.<br>Write any value to reset to zero.<br>Value: $FF04"},

    //TIMA ($FF05)
    {name: "rTIMA", description: "Timer counter (R/W)<br>Value: $FF05"},

    //TMA ($FF06)
    {name: "rTMA", description: "Timer modulo (R/W)<br>Value: $FF06"},

    //TAC ($FF07)
    {name: "rTAC", description: "Timer control (R/W)<br>Value: $FF07"},

    {name: "TACF_START",  description: "%00000100"},
    {name: "TACF_STOP",   description: "%00000000"},
    {name: "TACF_4KHZ",   description: "%00000000"},
    {name: "TACF_16KHZ",  description: "%00000011"},
    {name: "TACF_65KHZ",  description: "%00000010"},
    {name: "TACF_262KHZ", description: "%00000001"},

    //IF ($FF0F)
    {name: "rIF", description: "Interrupt Flag (R/W)<br>Contains the currently 'ready' interrupts, set by hardware, cleared when interrupt is executed.<br>Value: $FF0F"},

    //LCDC ($FF40)
    {name: "rLCDC", description: "LCD Control (R/W)<br>See: LCDCF_* constants for options.<br>Value: $FF40"},

    {name: "LCDCF_OFF",     description: "%00000000 ; LCD Control Operation"},
    {name: "LCDCF_ON",      description: "%10000000 ; LCD Control Operation"},
    {name: "LCDCF_WIN9800", description: "%00000000 ; Window Tile Map Display Select"},
    {name: "LCDCF_WIN9C00", description: "%01000000 ; Window Tile Map Display Select"},
    {name: "LCDCF_WINOFF",  description: "%00000000 ; Window Display"},
    {name: "LCDCF_WINON",   description: "%00100000 ; Window Display"},
    {name: "LCDCF_BG8800",  description: "%00000000 ; BG & Window Tile Data Select"},
    {name: "LCDCF_BG8000",  description: "%00010000 ; BG & Window Tile Data Select"},
    {name: "LCDCF_BG9800",  description: "%00000000 ; BG Tile Map Display Select"},
    {name: "LCDCF_BG9C00",  description: "%00001000 ; BG Tile Map Display Select"},
    {name: "LCDCF_OBJ8",    description: "%00000000 ; OBJ Construction"},
    {name: "LCDCF_OBJ16",   description: "%00000100 ; OBJ Construction"},
    {name: "LCDCF_OBJOFF",  description: "%00000000 ; OBJ Display"},
    {name: "LCDCF_OBJON",   description: "%00000010 ; OBJ Display"},
    {name: "LCDCF_BGOFF",   description: "%00000000 ; BG Display"},
    {name: "LCDCF_BGON",    description: "%00000001 ; BG Display"},


    //STAT ($FF41)
    {name: "rSTAT", description: "LCDC Status   (R/W)<br>Value: $FF41"},

    {name: "STATF_LYC",     description: " %01000000 ; LYCEQULY Coincidence (Selectable)"},
    {name: "STATF_MODE10",  description: " %00100000 ; Mode 10"},
    {name: "STATF_MODE01",  description: " %00010000 ; Mode 01 (V-Blank)"},
    {name: "STATF_MODE00",  description: " %00001000 ; Mode 00 (H-Blank)"},
    {name: "STATF_LYCF",    description: " %00000100 ; Coincidence Flag"},
    {name: "STATF_HB",      description: " %00000000 ; H-Blank"},
    {name: "STATF_VB",      description: " %00000001 ; V-Blank"},
    {name: "STATF_OAM",     description: " %00000010 ; OAM-RAM is used by system"},
    {name: "STATF_LCD",     description: " %00000011 ; Both OAM and VRAM used by system"},
    {name: "STATF_BUSY",    description: " %00000010 ; When set, VRAM access is unsafe"},


    //SCY ($FF42)
    {name: "rSCY", description: "Scroll Y (R/W)<br>Value: $FF42"},

    //SCY ($FF43)
    {name: "rSCX", description: "Scroll X (R/W)<br>Value: $FF43"},

    //LY ($FF44)
    {name: "rLY", description: "LCDC Y-Coordinate (R)<br>Values range from 0->153. 144->153 is the VBlank period.<br>Value: $FF44"},

    //LYC ($FF45)
    {name: "rLYC", description: "LY Compare (R/W)<br>When LY==LYC, STATF_LYCF will be set in STAT<br>Value: $FF45"},

    //DMA ($FF46)
    {name: "rDMA", description: "DMA Transfer and Start Address (W)<br>Value: $FF46"},

    //BGP ($FF47)
    {name: "rBGP", description: "BG Palette Data (W)<br>Bit 7-6 - Intensity for %11<br>Bit 5-4 - Intensity for %10<br>Bit 3-2 - Intensity for %01<br>Bit 1-0 - Intensity for %00<br>Value: $FF47"},
    //OBP0 ($FF48)
    {name: "rOBP0", description: "Object Palette 0 Data (W)<br>Bit 7-6 - Intensity for %11<br>Bit 5-4 - Intensity for %10<br>Bit 3-2 - Intensity for %01<br>Bit 1-0 - Ignored, %00 is transparent<br>Value: $FF48"},
    //OBP1 ($FF49)
    {name: "rOBP1", description: "Object Palette 1 Data (W)<br>Bit 7-6 - Intensity for %11<br>Bit 5-4 - Intensity for %10<br>Bit 3-2 - Intensity for %01<br>Bit 1-0 - Ignored, %00 is transparent<br>Value: $FF49"},

    //WY ($FF4A)
    {name: "rWY", description: "Window Y Position (R/W)<br>0 <= WY <= 143<br>Value: $FF4A"},

    //WX ($FF4B)
    {name: "rWX", description: "Window X Position (R/W)<br>7 <EQU WX <EQU 166<br>Value: $FF4B"},

    //KEY 1 ($FF4D)
    {name: "rKEY1", description: "Select CPU Speed (R/W) GBC Only!<br>Bit 7 contains current speed: 1 is double speed.<br>Write bit 0 to 1 and execute a STOP instruction to switch speed.<br>Value: $FF4D"},

    //VBK ($FF4F)
    {name: "rVBK", description: "Select Video RAM Bank (R/W) GBC Only!<br>Value: $FF4F"},


    //HDMA1 ($FF51)
    {name: "rHDMA1", description: "Horizontal Blanking, General Purpose DMA (W) GBC Only!<br>Value: $FF51"},
    //HDMA2 ($FF52)
    {name: "rHDMA2", description: "Horizontal Blanking, General Purpose DMA (W) GBC Only!<br>Value: $FF52"},
    //HDMA3 ($FF53)
    {name: "rHDMA3", description: "Horizontal Blanking, General Purpose DMA (W) GBC Only!<br>Value: $FF53"},
    //HDMA4 ($FF54)
    {name: "rHDMA4", description: "Horizontal Blanking, General Purpose DMA (W) GBC Only!<br>Value: $FF54"},
    //HDMA5 ($FF55)
    {name: "rHDMA5", description: "Horizontal Blanking, General Purpose DMA (R/W) GBC Only!<br>Value: $FF55"},

    //RP ($FF56)
    {name: "rRP", description: "Infrared Communications Port (R/W) GBC Only!<br>Value: $FF56"},

    //BCPS ($FF68)
    {name: "rBCPS", description: "Background Color Palette Specification (R/W) GBC Only!<br>Value: $FF68"},

    //BCPD ($FF69)
    {name: "rBCPD", description: "Background Color Palette Data (R/W) GBC Only!<br>Value: $FF69"},

    //BCPS ($FF6A)
    {name: "rOCPS", description: "Object Color Palette Specification (R/W) GBC Only!<br>Value: $FF6A"},

    //BCPD ($FF6B)
    {name: "rOCPD", description: "Object Color Palette Data (R/W) GBC Only!<br>Value: $FF6B"},

    //SVBK ($FF4F)
    {name: "rSVBK", description: "Select Main RAM Bank (R/W) GBC Only!<br>Value: $FF70"},

    //IE ($FFFF)
    {name: "rIE", description: "Interrupt Enable (R/W)<br>Value: $FFFF"},

    {name: "IEF_HILO",   description: "%00010000 ; Transition from High to Low of Pin number P10-P13"},
    {name: "IEF_SERIAL", description: "%00001000 ; Serial I/O transfer end"},
    {name: "IEF_TIMER",  description: "%00000100 ; Timer Overflow"},
    {name: "IEF_LCDC",   description: "%00000010 ; LCDC (see STAT)"},
    {name: "IEF_VBLANK", description: "%00000001 ; V-Blank"},

    ///Sound control registers

    //AUDVOL/NR50 ($FF24)
    {name: "rNR50", description: "Channel control / ON-OFF / Volume (R/W)<br>Bit 7   - Vin->SO2 ON/OFF (Vin??)<br>Bit 6-4 - SO2 output level (volume) (# 0-7)<br>Bit 3   - Vin->SO1 ON/OFF (Vin??)<br>Bit 2-0 - SO1 output level (volume) (# 0-7)<br>Value: $FF24<br>Aliased as rAUDVOL"},
    {name: "rAUDVOL", description: "Channel control / ON-OFF / Volume (R/W)<br>Bit 7   - Vin->SO2 ON/OFF (Vin??)<br>Bit 6-4 - SO2 output level (volume) (# 0-7)<br>Bit 3   - Vin->SO1 ON/OFF (Vin??)<br>Bit 2-0 - SO1 output level (volume) (# 0-7)<br>Value: $FF24<br>Alias of rNR50"},
    {name: "AUDVOL_VIN_LEFT",  description: "%10000000 ; SO2"},
    {name: "AUDVOL_VIN_RIGHT", description: "%00001000 ; SO1"},

    //AUDTERM/NR51 ($FF25)
    {name: "rNR51", description: "Selection of Sound output terminal (R/W)<br>Bit 7   - Output sound 4 to SO2 terminal<br>Bit 6   - Output sound 3 to SO2 terminal<br>Bit 5   - Output sound 2 to SO2 terminal<br>Bit 4   - Output sound 1 to SO2 terminal<br>Bit 3   - Output sound 4 to SO1 terminal<br>Bit 2   - Output sound 3 to SO1 terminal<br>Bit 1   - Output sound 2 to SO1 terminal<br>Bit 0   - Output sound 0 to SO1 terminal<br>Value: $FF25<br>Aliased as rAUDTERM"},
    {name: "rAUDTERM", description: "Selection of Sound output terminal (R/W)<br>Bit 7   - Output sound 4 to SO2 terminal<br>Bit 6   - Output sound 3 to SO2 terminal<br>Bit 5   - Output sound 2 to SO2 terminal<br>Bit 4   - Output sound 1 to SO2 terminal<br>Bit 3   - Output sound 4 to SO1 terminal<br>Bit 2   - Output sound 3 to SO1 terminal<br>Bit 1   - Output sound 2 to SO1 terminal<br>Bit 0   - Output sound 0 to SO1 terminal<br>Value: $FF25<br>Alias of rNR51"},
    //SO2
    {name: "AUDTERM_4_LEFT",  description: "%10000000"},
    {name: "AUDTERM_3_LEFT",  description: "%01000000"},
    {name: "AUDTERM_2_LEFT",  description: "%00100000"},
    {name: "AUDTERM_1_LEFT",  description: "%00010000"},
    //SO1
    {name: "AUDTERM_4_RIGHT", description: "%00001000"},
    {name: "AUDTERM_3_RIGHT", description: "%00000100"},
    {name: "AUDTERM_2_RIGHT", description: "%00000010"},
    {name: "AUDTERM_1_RIGHT", description: "%00000001"},


    //AUDENA/NR52 ($FF26)
    {name: "rNR52", description: "Sound on/off (R/W)<br>Bit 7   - All sound on/off (sets all audio regs to 0!)<br>Bit 3   - Sound 4 ON flag (read only)<br>Bit 2   - Sound 3 ON flag (read only)<br>Bit 1   - Sound 2 ON flag (read only)<br>Bit 0   - Sound 1 ON flag (read only)<br>Value: $FF26<br>Aliased as rAUDENA"},
    {name: "rAUDENA", description: "Sound on/off (R/W)<br>Bit 7   - All sound on/off (sets all audio regs to 0!)<br>Bit 3   - Sound 4 ON flag (read only)<br>Bit 2   - Sound 3 ON flag (read only)<br>Bit 1   - Sound 2 ON flag (read only)<br>Bit 0   - Sound 1 ON flag (read only)<br>Value: $FF26<br>Alias of rNR52"},
    {name: "AUDENA_ON",    description: "%10000000"},
    {name: "AUDENA_OFF",   description: "%00000000  ; sets all audio regs to 0!"},

    ///SoundChannel #1 registers

    //AUD1SWEEP/NR10 ($FF10)
    {name: "rNR10", description: "Sweep register (R/W)<br>Bit 6-4 - Sweep Time<br>Bit 3   - Sweep Increase/Decrease<br>&nbsp; 0: Addition<br>&nbsp; 1: Subtraction<br>Bit 2-0 - Number of sweep shift (# 0-7)<br>Sweep Time: (n*7.8ms)<br>Value: $FF10<br>Aliased as rAUD1SWEEP"},
    {name: "rAUD1SWEEP", description: "Sweep register (R/W)<br>Bit 6-4 - Sweep Time<br>Bit 3   - Sweep Increase/Decrease<br>&nbsp; 0: Addition<br>&nbsp; 1: Subtraction<br>Bit 2-0 - Number of sweep shift (# 0-7)<br>Sweep Time: (n*7.8ms)<br>Value: $FF10<br>Alias of rNR10"},
    {name: "AUD1SWEEP_UP",   description: "%00000000"},
    {name: "AUD1SWEEP_DOWN", description: "%00001000"},

    //AUD1LEN/NR11 ($FF11)
    {name: "rNR11", description: "Sound length/Wave pattern duty (R/W)<br>Bit 7-6 - Wave Pattern Duty (00:12.5% 01:25% 10:50% 11:75%)<br>Bit 5-0 - Sound length data (# 0-63)<br>Value: $FF11<br>Aliased as rAUD1LEN"},
    {name: "rAUD1LEN", description: "Sound length/Wave pattern duty (R/W)<br>Bit 7-6 - Wave Pattern Duty (00:12.5% 01:25% 10:50% 11:75%)<br>Bit 5-0 - Sound length data (# 0-63)<br>Value: $FF11<br>Alias of rNR11"},

    //AUD1ENV/NR12 ($FF12)
    //Envelope (R/W)
    //
    //Bit 7-4 - Initial value of envelope
    //Bit 3   - Envelope UP/DOWN
    //          0: Decrease
    //          1: Range of increase
    //Bit 2-0 - Number of envelope sweep (# 0-7)
    //
    {name: "rNR12", description: "$FF12"},
    {name: "rAUD1ENV", description: "Alias of rNR12"},


    //
    //AUD1LOW/NR13 ($FF13)
    //Frequency lo (W)
    //
    {name: "rNR13", description: "$FF13"},
    {name: "rAUD1LOW", description: "Alias of rNR13"},


    //
    //AUD1HIGH/NR14 ($FF14)
    //Frequency hi (W)
    //
    //Bit 7   - Initial (when set, sound restarts)
    //Bit 6   - Counter/consecutive selection
    //Bit 2-0 - Frequency's higher 3 bits
    //
    {name: "rNR14", description: "$FF14"},
    {name: "rAUD1HIGH", description: "Alias of rNR14"},


    ///SoundChannel #2 registers

    //
    //AUD2LEN/NR21 ($FF16)
    //Sound Length; Wave Pattern Duty (R/W)
    //
    //see AUD1LEN for info
    //
    {name: "rNR21", description: "$FF16"},
    {name: "rAUD2LEN", description: "Alias of rNR21"},


    //
    //AUD2ENV/NR22 ($FF17)
    //Envelope (R/W)
    //
    //see AUD1ENV for info
    //
    {name: "rNR22", description: "$FF17"},
    {name: "rAUD2ENV", description: "Alias of rNR22"},


    //
    //AUD2LOW/NR23 ($FF18)
    //Frequency lo (W)
    //
    {name: "rNR23", description: "$FF18"},
    {name: "rAUD2LOW", description: "Alias of rNR23"},


    //
    //AUD2HIGH/NR24 ($FF19)
    //Frequency hi (W)
    //
    //see AUD1HIGH for info
    //
    {name: "rNR24", description: "$FF19"},
    {name: "rAUD2HIGH", description: "Alias of rNR24"},


    ///SoundChannel #3 registers

    //AUD3ENA/NR30 ($FF1A)
    //Sound on/off (R/W)
    //
    //Bit 7   - Sound ON/OFF (1EQUON,0EQUOFF)
    //
    {name: "rNR30", description: "$FF1A"},
    {name: "rAUD3ENA", description: "Alias of rNR30"},


    //
    //AUD3LEN/NR31 ($FF1B)
    //Sound length (R/W)
    //
    //Bit 7-0 - Sound length
    //
    {name: "rNR31", description: "$FF1B"},
    {name: "rAUD3LEN", description: "Alias of rNR31"},


    //
    //AUD3LEVEL/NR32 ($FF1C)
    //Select output level
    //
    //Bit 6-5 - Select output level
    //          00: 0/1 (mute)
    //          01: 1/1
    //          10: 1/2
    //          11: 1/4
    //
    {name: "rNR32", description: "$FF1C"},
    {name: "rAUD3LEVEL", description: "Alias of rNR32"},


    //
    //AUD3LOW/NR33 ($FF1D)
    //Frequency lo (W)
    //
    //see AUD1LOW for info
    //
    {name: "rNR33", description: "$FF1D"},
    {name: "rAUD3LOW", description: "Alias of rNR33"},


    //
    //AUD3HIGH/NR34 ($FF1E)
    //Frequency hi (W)
    //
    //see AUD1HIGH for info
    //
    {name: "rNR34", description: "$FF1E"},
    {name: "rAUD3HIGH", description: "Alias of rNR34"},


    //
    //AUD4LEN/NR41 ($FF20)
    //Sound length (R/W)
    //
    //Bit 5-0 - Sound length data (# 0-63)
    //
    {name: "rNR41", description: "$FF20"},
    {name: "rAUD4LEN", description: "Alias of rNR41"},


    //
    //AUD4ENV/NR42 ($FF21)
    //Envelope (R/W)
    //
    //see AUD1ENV for info
    //
    {name: "rNR42", description: "$FF21"},
    {name: "rAUD4ENV", description: "Alias of rNR42"},


    //
    //AUD4POLY/NR43 ($FF22)
    //Polynomial counter (R/W)
    //
    //Bit 7-4 - Selection of the shift clock frequency of the (scf)
    //          polynomial counter (0000-1101)
    //          freqEQUdrf*1/2^scf (not sure)
    //Bit 3 -   Selection of the polynomial counter's step
    //          0: 15 steps
    //          1: 7 steps
    //Bit 2-0 - Selection of the dividing ratio of frequencies (drf)
    //          000: f/4   001: f/8   010: f/16  011: f/24
    //          100: f/32  101: f/40  110: f/48  111: f/56  (fEQU4.194304 Mhz)
    //
    {name: "rNR43", description: "$FF22"},
    {name: "rAUD4POLY", description: "Alias of rNR43"},


    //
    //AUD4GO/NR44 ($FF23)
    //
    //Bit 7 -   Inital
    //Bit 6 -   Counter/consecutive selection
    //
    {name: "rNR44", description: "$FF23"},
    {name: "rAUD4GO", description: "Alias of rNR44"},


    //
    //PCM12 ($FF76)
    //Sound channel 1&2 PCM amplitude (R)
    //
    //Bit 7-4 - Copy of sound channel 2's PCM amplitude
    //Bit 3-0 - Copy of sound channel 1's PCM amplitude
    //
    {name: "rPCM12", description: "$FF76"},


    //
    //PCM34 ($FF77)
    //Sound channel 3&4 PCM amplitude (R)
    //
    //Bit 7-4 - Copy of sound channel 4's PCM amplitude
    //Bit 3-0 - Copy of sound channel 3's PCM amplitude
    //
    {name: "rPCM34", description: "$FF77"},


    ///Flags common to multiple sound channels

    //
    //Square wave duty cycle
    //
    //Can be used with AUD1LEN and AUD2LEN
    //See AUD1LEN for more info
    //
    {name: "AUDLEN_DUTY_12_5",    description: "%00000000 ; 12.5%"},
    {name: "AUDLEN_DUTY_25",      description: "%01000000 ; 25%"},
    {name: "AUDLEN_DUTY_50",      description: "%10000000 ; 50%"},
    {name: "AUDLEN_DUTY_75",      description: "%11000000 ; 75%"},


    //
    //Audio envelope flags
    //
    //Can be used with AUD1ENV, AUD2ENV, AUD4ENV
    //See AUD1ENV for more info
    //
    {name: "AUDENV_UP",           description: "%00001000"},
    {name: "AUDENV_DOWN",         description: "%00000000"},


    ///Audio trigger flags
    //Can be used with AUD1HIGH, AUD2HIGH, AUD3HIGH
    //See AUD1HIGH for more info

    {name: "AUDHIGH_RESTART",     description: "%10000000"},
    {name: "AUDHIGH_LENGTH_ON",   description: "%01000000"},
    {name: "AUDHIGH_LENGTH_OFF",  description: "%00000000"},

    //Cart related
    {name: "CART_COMPATIBLE_DMG",     description: "$00"},
    {name: "CART_COMPATIBLE_DMG_GBC", description: "$80"},
    {name: "CART_COMPATIBLE_GBC",     description: "$C0"},

    {name: "CART_ROM",                     description: "$00"},
    {name: "CART_ROM_MBC1",                description: "$01"},
    {name: "CART_ROM_MBC1_RAM",            description: "$02"},
    {name: "CART_ROM_MBC1_RAM_BAT",        description: "$03"},
    {name: "CART_ROM_MBC2",                description: "$05"},
    {name: "CART_ROM_MBC2_BAT",            description: "$06"},
    {name: "CART_ROM_RAM",                 description: "$08"},
    {name: "CART_ROM_RAM_BAT",             description: "$09"},
    {name: "CART_ROM_MBC3_BAT_RTC",        description: "$0F"},
    {name: "CART_ROM_MBC3_RAM_BAT_RTC",    description: "$10"},
    {name: "CART_ROM_MBC3",                description: "$11"},
    {name: "CART_ROM_MBC3_RAM",            description: "$12"},
    {name: "CART_ROM_MBC3_RAM_BAT",        description: "$13"},
    {name: "CART_ROM_MBC5",                description: "$19"},
    {name: "CART_ROM_MBC5_BAT",            description: "$1A"},
    {name: "CART_ROM_MBC5_RAM_BAT",        description: "$1B"},
    {name: "CART_ROM_MBC5_RUMBLE",         description: "$1C"},
    {name: "CART_ROM_MBC5_RAM_RUMBLE",     description: "$1D"},
    {name: "CART_ROM_MBC5_RAM_BAT_RUMBLE", description: "$1E"},
    {name: "CART_ROM_MBC7_RAM_BAT_GYRO",   description: "$22"},
    {name: "CART_ROM_POCKET_CAMERA",       description: "$FC"},

    {name: "CART_ROM_256K", description: "0 ; 2 banks"},
    {name: "CART_ROM_512K", description: "1 ; 4 banks"},
    {name: "CART_ROM_1M",   description: "2 ; 8 banks"},
    {name: "CART_ROM_2M",   description: "3 ; 16 banks"},
    {name: "CART_ROM_4M",   description: "4 ; 32 banks"},
    {name: "CART_ROM_8M",   description: "5 ; 64 banks"},
    {name: "CART_ROM_16M",  description: "6 ; 128 banks"},
    {name: "CART_ROM_32M",  description: "7 ; 256 banks"},
    {name: "CART_ROM_64M",  description: "8 ; 512 banks"},

    {name: "CART_RAM_NONE", description: "0"},
    {name: "CART_RAM_16K",  description: "1 ; 1 incomplete bank"},
    {name: "CART_RAM_64K",  description: "2 ; 1 bank"},
    {name: "CART_RAM_256K", description: "3 ; 4 banks"},
    {name: "CART_RAM_1M",   description: "4 ; 16 banks"},

    {name: "CART_RAM_ENABLE",  description: "$0A"},
    {name: "CART_RAM_DISABLE", description: "$00"},

    //Keypad related
    {name: "PADF_DOWN",   description: "$80"},
    {name: "PADF_UP",     description: "$40"},
    {name: "PADF_LEFT",   description: "$20"},
    {name: "PADF_RIGHT",  description: "$10"},
    {name: "PADF_START",  description: "$08"},
    {name: "PADF_SELECT", description: "$04"},
    {name: "PADF_B",      description: "$02"},
    {name: "PADF_A",      description: "$01"},

    {name: "PADB_DOWN",   description: "$7"},
    {name: "PADB_UP",     description: "$6"},
    {name: "PADB_LEFT",   description: "$5"},
    {name: "PADB_RIGHT",  description: "$4"},
    {name: "PADB_START",  description: "$3"},
    {name: "PADB_SELECT", description: "$2"},
    {name: "PADB_B",      description: "$1"},
    {name: "PADB_A",      description: "$0"},

    //Screen related
    {name: "SCRN_X",    description: "160 ; Width of screen in pixels"},
    {name: "SCRN_Y",    description: "144 ; Height of screen in pixels"},
    {name: "SCRN_X_B",  description: "20  ; Width of screen in bytes"},
    {name: "SCRN_Y_B",  description: "18  ; Height of screen in bytes"},

    {name: "SCRN_VX",   description: "256 ; Virtual width of screen in pixels"},
    {name: "SCRN_VY",   description: "256 ; Virtual height of screen in pixels"},
    {name: "SCRN_VX_B", description: "32  ; Virtual width of screen in bytes"},
    {name: "SCRN_VY_B", description: "32  ; Virtual height of screen in bytes"},
]

var gbz80CompleterInstructions = []
gbz80Instructions.forEach(function(instr) {
    var doc = "<table><tr><td colspan=2>" + instr["description"];
    doc += "<tr><td>cycles:<td>" + instr["cycles"];
    doc += "<tr><td>size:<td>" + instr["bytes"];
    doc += "<tr><td>Flag Z:<td>" + instr["flags"]["z"];
    doc += "<tr><td>Flag N:<td>" + instr["flags"]["n"];
    doc += "<tr><td>Flag H:<td>" + instr["flags"]["H"];
    doc += "<tr><td>Flag C:<td>" + instr["flags"]["C"];
    var i = {
        caption: instr["name"], value: instr["name"], meta: "",
        docHTML: doc,
    };
    i.completer = { insertMatch: function(editor, data) {
        //editor.completer.insertMatch({value: data.value.split(" ")[0]});
        //editor.selection.selectTo(editor.selection.cursor.row, editor.selection.cursor.column - offset);
    }}
    gbz80CompleterInstructions.push(i);
});
var gbz80CompleterRegisters = []
gbz80HardwareInc.forEach(function(reg) {
    gbz80CompleterRegisters.push({
        caption: reg.name, value: reg.name,
        docHTML: reg.description,
    });
});

var gbz80Completer = {
    getCompletions: function(editor, session, pos, prefix, callback) {
        var line = session.getLine(pos.row);
        // Check if we are possibly typing an instruction.
        var before = line.substr(0, pos.column - 1).trim();
        if (before.trim() == "" || before.trim().endsWith(":")) {
            callback(null, gbz80CompleterInstructions.filter(function(c) {
                return c.value.startsWith(prefix.toLowerCase());
            }));
        } else {
            callback(null, gbz80CompleterRegisters);
        }
    }
}
