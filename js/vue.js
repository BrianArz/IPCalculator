var app = new Vue({
    el: "#main", 
    data: {
        // Input variables
        firstOctate: "192",
        secondOctate: "168",
        thirdOctate: "0",
        fourthOctate: "1", 
        netmask: "24",
        moveTo: "",

        // Information Variables
        mainAddress: "0.0.0.0",
        mainNetmask: "00000000.00000000.00000000.00000000",
        mainWildcard: "00000000.00000000.00000000.00000000",
        mainNetwork: "00000000.00000000.00000000.00000000",
        mainMinHost: "00000000.00000000.00000000.00000000",
        mainMaxHost: "00000000.00000000.00000000.00000000",
        mainBroadcast: "00000000.00000000.00000000.00000000",
        mainHostsXNet: 0,
        mainClass: "",

        // Subnet Variables
        subnetNetmask: "0.0.0.0",
        subnetWildcard: "0.0.0.0",
        subnetNumber: 0,

        // Supnet Variables
        supnetNetmask: "00000000.00000000.00000000.00000000",
        supnetWildcard: "00000000.00000000.00000000.00000000",
        supnetNetwork: "00000000.00000000.00000000.00000000",
        supnetMinHost: "00000000.00000000.00000000.00000000",
        supnetMaxHost: "00000000.00000000.00000000.00000000",
        supnetBroadcast: "00000000.00000000.00000000.00000000",
        supnetHostsXNet: 0,
        supnetClass: "",

        // Table Variables 
        subnets: [
            
        ],
        broadcastColumn : true,
        routeColumn : false,

        // Control Variables
        mainBroadcastDiv : true,
        mainMinMaxDiv: true,
        mainRouteDiv: false,

        subnetDiv : false, 

        supnetDiv : false,
        supnetBroadcastDiv : true,
    }, 
    methods: {

        // Gets Main IP Adress
        getIP(){
            return app.firstOctate + "." + app.secondOctate + "." + app.thirdOctate + "." + app.fourthOctate;
        }, 
        setRawNetmask(bitNumber){
            let fullOctateIP = "";
            for(i = 1 ; i <= 32 ; i++){
                if(i <= bitNumber){
                    fullOctateIP = fullOctateIP + "1";
                }else{
                    fullOctateIP = fullOctateIP + "0";
                }
            }
            return fullOctateIP ;
        },
        setRawWildcard(bitNumber){
            let fullOctateIP = "";
            for(i = 1 ; i <= 32 ; i++){
                if(i <= bitNumber){
                    fullOctateIP = fullOctateIP + "0";
                }else{
                    fullOctateIP = fullOctateIP + "1";
                }
            }
            return fullOctateIP ;
        },
        setRawIpAddress(ipAddress){
            return ipAddress.slice(0, 8) + ipAddress.slice(9 , 17) + ipAddress.slice(18, 26) + ipAddress.slice(27 , 35);
        },
        getBitOctates(rawNetmask){
            let f1Octate = "";
            let f2Octate = "";
            let f3Octate = "";
            let f4Octate = "";
            for(i = 0 ; i < 8 ; i++){
                f1Octate = f1Octate + rawNetmask.charAt(i);
                f2Octate = f2Octate + rawNetmask.charAt(8 + i);
                f3Octate = f3Octate + rawNetmask.charAt(16 + i);
                f4Octate = f4Octate + rawNetmask.charAt(24 + i);
            }
            return [f1Octate , f2Octate , f3Octate , f4Octate];
        },
        getOctates(ipAddress){
            let f1Octate = "";
            let f2Octate = "";
            let f3Octate = "";
            let f4Octate = "";

            if(ipAddress.length > 16){
                for(i = 0 ; i < 8 ; i++){
                    f1Octate = f1Octate + ipAddress.charAt(i);
                    f2Octate = f2Octate + ipAddress.charAt(9 + i);
                    f3Octate = f3Octate + ipAddress.charAt(18 + i);
                    f4Octate = f4Octate + ipAddress.charAt(27 + i);
                }
            }else{
                let firstDot = 0;
                let secondDot = 0;
                let thirdDot = 0;
                let count = 0;
                for(i = 0; i <= ipAddress.length ; i++){
                    if (ipAddress.charAt(i) === "."){
                        count++;
                        if(count === 1){
                            firstDot = i;
                        }
                        if(count === 2){
                            secondDot = i;
                        }
                        if(count === 3){
                            thirdDot = i;
                        }
                    }
                }

                f1Octate = parseInt(ipAddress.substring(0 , firstDot));
                f2Octate = parseInt(ipAddress.substring(firstDot + 1, secondDot));
                f3Octate = parseInt(ipAddress.substring(secondDot + 1 , thirdDot));
                f4Octate = parseInt(ipAddress.substring(thirdDot + 1 , ipAddress.length));
            }

            return [f1Octate, f2Octate, f3Octate, f4Octate]
        },
        formatIP(f1Octate, f2Octate, f3Octate, f4Octate){
            return f1Octate + "." + f2Octate + "." + f3Octate + "." + f4Octate;
        },
        decimalToBinary(octate){
            let binary = (octate >>> 0).toString(2);
            binary = binary.toString();
            while(binary.length < 8){
                binary = "0" + binary;
            }
            return binary
        },
        binaryToDecimal(octate){
            return parseInt(octate, 2);
        },
        convertIpAddress(ipAddress){           
            let octates = this.getOctates(ipAddress);

            if(Number.isInteger(octates[0])){
                octates[0] = this.decimalToBinary(octates[0]);
                octates[1] = this.decimalToBinary(octates[1]);
                octates[2] = this.decimalToBinary(octates[2]);
                octates[3] = this.decimalToBinary(octates[3]);
            }else{
                octates[0] = this.binaryToDecimal(octates[0]);
                octates[1] = this.binaryToDecimal(octates[1]);
                octates[2] = this.binaryToDecimal(octates[2]);
                octates[3] = this.binaryToDecimal(octates[3]);
            }
            
            return this.formatIP(octates[0], octates[1], octates[2], octates[3]);
        },
        getNetwork(rawIpAddress, bitNumber){
            for(i = bitNumber ; i < 32 ; i++){
                rawIpAddress = this.replaceAt(rawIpAddress, i , "0");
            }
            return rawIpAddress;
        },
        replaceAt(str, index, replacement){
            return str.substr(0, index) + replacement + str.substr(index + replacement.length);
        },
        changeLastBit(lastOctate){
            if(lastOctate.charAt(7) === "0"){
                lastOctate = this.replaceAt(lastOctate, 7, "1");
            }else{
                lastOctate = this.replaceAt(lastOctate, 7, "0");
            }
            return lastOctate;
        },
        changeNetmaskBits(ip, bitNumber){
            ip = this.setRawIpAddress(ip);
            for(i = bitNumber ; i < 32 ; i++){
                ip = this.replaceAt(ip, i , "1");
            }
            let ipOctates = this.getBitOctates(ip);
            return this.formatIP(ipOctates[0], ipOctates[1], ipOctates[2], ipOctates[3]);
        },
        getMinHost(networkIp){
            let networkIpOctates = this.getOctates(networkIp); 
            networkIpOctates[3] = this.changeLastBit(networkIpOctates[3]);
            return this.formatIP(networkIpOctates[0], networkIpOctates[1], networkIpOctates[2], networkIpOctates[3] );
        },
        getMaxHost(broadcastIp){
            let broadcastOctates = this.getOctates(broadcastIp);
            broadcastOctates[3] = this.changeLastBit(broadcastOctates[3]); 
            return this.formatIP(broadcastOctates[0], broadcastOctates[1], broadcastOctates[2], broadcastOctates[3]);
        },
        getBroadcast(networkIp, netmask){
            return this.changeNetmaskBits(networkIp, netmask);
        },
        getHostsXNet(netmask){
            let hostBits = 32 - netmask;
            if(hostBits <= 1){
                return Math.pow(2, hostBits);
            }else{
                return Math.pow(2, hostBits) - 2;
            }
            
        },
        getClass(ipAddress){
            let ipAddressOctates = this.getOctates(ipAddress);
            if(ipAddressOctates[0].charAt(0) === "0"){
                return "A";
            }
            if(ipAddressOctates[0].charAt(0) === "1" && ipAddressOctates[0].charAt(1) === "0"){
                return "B";
            }
            if(ipAddressOctates[0].charAt(0) === "1" && ipAddressOctates[0].charAt(1) === "1" && ipAddressOctates[0].charAt(2) === "0"){
                return "C";
            }
            
        },
        computeSubnetInformation(networkIp, netmask , moveTo){
            let netmaskOctates = this.getBitOctates(this.setRawNetmask(moveTo));
            app.subnetNetmask = this.formatIP(netmaskOctates[0] , netmaskOctates[1] , netmaskOctates[2] , netmaskOctates[3]);

            let wilcardOctates = this.getBitOctates(this.setRawWildcard(moveTo));
            app.subnetWildcard = this.formatIP(wilcardOctates[0], wilcardOctates[1], wilcardOctates[2], wilcardOctates[3]);

            if(netmask === moveTo){
                subnetDiv = false;
            }
            app.subnets = [];
            let newHostBits = moveTo - netmask;
            let decimalHostBits = Math.pow(2, newHostBits);
            let hostsxnet = Math.pow(2 , (32 - moveTo)) - 2;
            let subnets = decimalHostBits;
            app.subnetNumber = subnets;

            let initialMinHost = "";
            let initialBroadcast = this.getBroadcast(networkIp, moveTo);
            let initialMaxHost = "";
            if(parseInt(moveTo) === 31){
                app.broadcastColumn = false;
                app.routeColumn = false;
                initialMinHost = networkIp;
                initialMaxHost = this.getMaxHost(initialMinHost);
            }if(parseInt(moveTo) < 31){
                app.broadcastColumn = true;
                app.routeColumn = false;
                initialMinHost = this.getMinHost(networkIp);
                initialMaxHost = this.getMaxHost(initialBroadcast);
            }if(parseInt(moveTo) === 32){
                app.broadcastColumn = false;
                app.routeColumn = true;
            }
            app.subnets.push({id: "1" , network: this.convertIpAddress(networkIp), minhost: this.convertIpAddress(initialMinHost), maxhost: this.convertIpAddress(initialMaxHost), broadcast: this.convertIpAddress(initialBroadcast), hostsxnet: hostsxnet});

            let iterationNetworkIp = networkIp;
            let iterationMinHost = "";
            let iterationBroadcast = "";
            let iterationMaxHost = "";
    
            for(x = 2 ; x <= subnets  ; x++){

                iterationNetworkIp = this.addSubnet(iterationNetworkIp, moveTo);
                iterationBroadcast = this.getBroadcast(iterationNetworkIp, moveTo);

                if(parseInt(moveTo) === 31){
                    app.minMaxColumn = true;
                    app.broadcastColumn = false;
                    app.routeColumn = false;
                    iterationMinHost = iterationNetworkIp;
                    iterationMaxHost = this.getMaxHost(iterationMinHost);
                }if(parseInt(moveTo) < 31){
                    app.minMaxColumn = true;
                    app.broadcastColumn = true;
                    app.routeColumn = false;
                    iterationMinHost = this.getMinHost(iterationNetworkIp);
                    iterationMaxHost = this.getMaxHost(iterationBroadcast);
                }if(parseInt(moveTo) === 32){
                    app.minMaxColumn = false;
                    app.broadcastColumn = false;
                    app.routeColumn = true;
                }

                app.subnets.push({id: x , network: this.convertIpAddress(iterationNetworkIp), minhost: this.convertIpAddress(iterationMinHost), maxhost: this.convertIpAddress(iterationMaxHost), broadcast: this.convertIpAddress(iterationBroadcast), hostsxnet: hostsxnet});

                if(x > 9999){
                    break;
                }
            }
        },
        addSubnet(networkIp, moveTo){
            let network = this.setRawIpAddress(networkIp);
            let subnet = this.formatTo32Bit(moveTo);
            let sum = this.sumTwoBinaryNumbers(network, subnet);
            return this._32BitToIpAddress(sum);
        },
        formatTo32Bit(position){
            let binary = "";
            while(binary.length < position - 1 ){
                binary = "0" + binary;
            }
            binary = binary + "1";
            while(binary.length < 32){
                binary = binary + "0";
            }
            return binary;
        },
        sumTwoBinaryNumbers(a , b){
            a = this.binaryToDecimal(a);
            b = this.binaryToDecimal(b);
            let c = a + b;
            return this.decimalToBinary(c);
        },
        _32BitToIpAddress(rawIpAddress){
            ipAddressOctates = this.getBitOctates(rawIpAddress);
            let ipBitAddress = this.formatIP(ipAddressOctates[0], ipAddressOctates[1] , ipAddressOctates[2] , ipAddressOctates[3]);
            return ipBitAddress;
        },
        computeSupnetInformation(networkIp, ipAddress, moveTo){
            let netmaskOctates = this.getBitOctates(this.setRawNetmask(moveTo));
            app.supnetNetmask = this.formatIP(netmaskOctates[0] , netmaskOctates[1] , netmaskOctates[2] , netmaskOctates[3]);

            let wilcardOctates = this.getBitOctates(this.setRawWildcard(moveTo));
            app.supnetWildcard = this.formatIP(wilcardOctates[0], wilcardOctates[1], wilcardOctates[2], wilcardOctates[3]);

            let rawIpAddress = this.setRawIpAddress(this.convertIpAddress(ipAddress));
            let rawNetworkOctates = this.getBitOctates(this.getNetwork(rawIpAddress, parseInt(moveTo)));
            app.supnetNetwork = this.formatIP(rawNetworkOctates[0], rawNetworkOctates[1], rawNetworkOctates[2], rawNetworkOctates[3]);

            if(parseInt(moveTo) <= 30){
                app.supnetBroadcastDiv = true;
                app.supnetMinHost = this.getMinHost(networkIp, moveTo);
                app.supnetBroadcast = this.getBroadcast(networkIp, parseInt(moveTo));
                app.supnetMaxHost = this.getMaxHost(app.supnetBroadcast);
            }if(parseInt(moveTo) === 31){
                app.supnetBroadcastDiv = false;
                app.supnetMinHost = app.supnetNetwork;
                app.supnetMaxHost = this.getMaxHost(app.supnetMinHost);
            }if(parseInt(moveTo) === 32){
                app.supnetDiv = false;
            }

            app.supnetHostsXNet = this.getHostsXNet(parseInt(moveTo));

            app.supnetClass = this.getClass(this.convertIpAddress(ipAddress));
        },
        computeMainInformation(){
            app.mainAddress = this.getIP();

            let netmaskOctates = this.getBitOctates(this.setRawNetmask(app.netmask));
            app.mainNetmask = this.formatIP(netmaskOctates[0] , netmaskOctates[1] , netmaskOctates[2] , netmaskOctates[3]);

            let wilcardOctates = this.getBitOctates(this.setRawWildcard(app.netmask));
            app.mainWildcard = this.formatIP(wilcardOctates[0], wilcardOctates[1], wilcardOctates[2], wilcardOctates[3]);

            let rawIpAddress = this.setRawIpAddress(this.convertIpAddress(app.mainAddress));
            let rawNetworkOctates = this.getBitOctates(this.getNetwork(rawIpAddress, parseInt(app.netmask)));
            app.mainNetwork = this.formatIP(rawNetworkOctates[0], rawNetworkOctates[1], rawNetworkOctates[2], rawNetworkOctates[3]);

            if(parseInt(app.netmask) <= 30){
                app.mainBroadcastDiv = true;
                app.mainMinMaxDiv = true;
                app.mainRouteDiv = false;
                app.mainMinHost = this.getMinHost(app.mainNetwork, app.netmask);
                app.mainBroadcast = this.getBroadcast(app.mainNetwork, parseInt(app.netmask));
                app.mainMaxHost = this.getMaxHost(app.mainBroadcast);
            }if(parseInt(app.netmask) === 31){
                app.mainBroadcastDiv = false;
                app.mainMinMaxDiv = true;
                app.mainRouteDiv = false;
                app.mainMinHost = app.mainNetwork;
                app.mainMaxHost = this.getMaxHost(app.mainMinHost);
            }
            if(parseInt(app.netmask) === 32){
                app.mainBroadcastDiv = false;
                app.mainMinMaxDiv = false;
                app.mainRouteDiv = true;
            }

            app.mainHostsXNet = this.getHostsXNet(parseInt(app.netmask));

            app.mainClass = this.getClass(this.convertIpAddress(app.mainAddress));

            if(app.moveTo !== ""){
                if(parseInt(app.netmask) < parseInt(app.moveTo)){
                    app.supnetDiv = false;
                    app.subnetDiv = true;
                    this.computeSubnetInformation(app.mainNetwork, app.netmask, app.moveTo);
                }
                if(parseInt(app.netmask) > parseInt(app.moveTo)){
                    app.subnetDiv = false;
                    app.supnetDiv = true;
                    this.computeSupnetInformation(app.mainNetwork, app.mainAddress , app.moveTo);
                }
            }
        }
    },
})
