import { Navbar } from "@/components/Navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function SizeGuide() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-8">
          <div>
            <h1 className="text-4xl font-bold mb-4">Adaptive Clothing Size Guide</h1>
            <p className="text-muted-foreground text-lg">
              Specially designed measurements for wheelchair users and different mobility needs
            </p>
          </div>

          {/* Wheelchair User Sizes */}
          <Card>
            <CardHeader>
              <CardTitle>Wheelchair User Sizes</CardTitle>
              <CardDescription>
                Designed with seated measurements, longer torso length, and easier access
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Size</TableHead>
                    <TableHead>Chest (inches)</TableHead>
                    <TableHead>Seated Waist (inches)</TableHead>
                    <TableHead>Torso Length (inches)</TableHead>
                    <TableHead>Shoulder Width (inches)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">S</TableCell>
                    <TableCell>34-36</TableCell>
                    <TableCell>28-30</TableCell>
                    <TableCell>27-29</TableCell>
                    <TableCell>16-17</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">M</TableCell>
                    <TableCell>38-40</TableCell>
                    <TableCell>32-34</TableCell>
                    <TableCell>29-31</TableCell>
                    <TableCell>17-18</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">L</TableCell>
                    <TableCell>42-44</TableCell>
                    <TableCell>36-38</TableCell>
                    <TableCell>31-33</TableCell>
                    <TableCell>18-19</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">XL</TableCell>
                    <TableCell>46-48</TableCell>
                    <TableCell>40-42</TableCell>
                    <TableCell>33-35</TableCell>
                    <TableCell>19-20</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">2XL</TableCell>
                    <TableCell>50-52</TableCell>
                    <TableCell>44-46</TableCell>
                    <TableCell>35-37</TableCell>
                    <TableCell>20-21</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Limited Mobility Upper Body */}
          <Card>
            <CardHeader>
              <CardTitle>Limited Upper Body Mobility</CardTitle>
              <CardDescription>
                Features wider arm openings and easier shoulder access
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Size</TableHead>
                    <TableHead>Chest (inches)</TableHead>
                    <TableHead>Waist (inches)</TableHead>
                    <TableHead>Arm Opening (inches)</TableHead>
                    <TableHead>Back Width (inches)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">S</TableCell>
                    <TableCell>34-36</TableCell>
                    <TableCell>28-30</TableCell>
                    <TableCell>18-19</TableCell>
                    <TableCell>15-16</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">M</TableCell>
                    <TableCell>38-40</TableCell>
                    <TableCell>32-34</TableCell>
                    <TableCell>19-20</TableCell>
                    <TableCell>16-17</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">L</TableCell>
                    <TableCell>42-44</TableCell>
                    <TableCell>36-38</TableCell>
                    <TableCell>20-21</TableCell>
                    <TableCell>17-18</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">XL</TableCell>
                    <TableCell>46-48</TableCell>
                    <TableCell>40-42</TableCell>
                    <TableCell>21-22</TableCell>
                    <TableCell>18-19</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Adaptive Pants Sizes */}
          <Card>
            <CardHeader>
              <CardTitle>Adaptive Pants & Shorts</CardTitle>
              <CardDescription>
                Elastic waist, seated measurements, no buttons for easy wear
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Size</TableHead>
                    <TableHead>Seated Waist (inches)</TableHead>
                    <TableHead>Hip (inches)</TableHead>
                    <TableHead>Seated Rise (inches)</TableHead>
                    <TableHead>Inseam Options (inches)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">S</TableCell>
                    <TableCell>28-30</TableCell>
                    <TableCell>36-38</TableCell>
                    <TableCell>13-14</TableCell>
                    <TableCell>26, 28, 30</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">M</TableCell>
                    <TableCell>32-34</TableCell>
                    <TableCell>40-42</TableCell>
                    <TableCell>14-15</TableCell>
                    <TableCell>28, 30, 32</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">L</TableCell>
                    <TableCell>36-38</TableCell>
                    <TableCell>44-46</TableCell>
                    <TableCell>15-16</TableCell>
                    <TableCell>30, 32, 34</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">XL</TableCell>
                    <TableCell>40-42</TableCell>
                    <TableCell>48-50</TableCell>
                    <TableCell>16-17</TableCell>
                    <TableCell>32, 34, 36</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Measurement Tips */}
          <Card>
            <CardHeader>
              <CardTitle>How to Measure</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">For Wheelchair Users:</h3>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  <li>Take all measurements while seated in wheelchair</li>
                  <li>Torso length: Measure from base of neck to seated waist</li>
                  <li>Seated waist: Measure around natural waist while seated</li>
                  <li>Seated rise: Measure from waist to seat</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2">For Limited Mobility:</h3>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  <li>Measure in most comfortable position</li>
                  <li>Allow extra room for ease of movement</li>
                  <li>Consider assistance needs when choosing size</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Key Features to Note:</h3>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  <li>Magnetic closures eliminate need for buttons and zippers</li>
                  <li>Elastic waistbands adjust to different positions</li>
                  <li>Wider openings make dressing easier</li>
                  <li>Extended back coverage for seated positions</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
